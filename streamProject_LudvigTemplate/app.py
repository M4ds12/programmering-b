import requests as r
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlunparse
from datetime import datetime
import json
import random, string, time
import hashlib, user_agents


class Soup2DayWrapper:
    def search(s):
        resp = r.get(f'https://ww25.soap2day.day?s={s}')
        soup = BeautifulSoup(resp.text, "html.parser")
        movies = soup.find(id="movies")
        tvshows = soup.find(id="tvshows")
        if not movies:
            return {'movies':[], 'tvshows':[]}
        
        return {
            'movies': [(
                am.get('oldtitle'), 
                am.get('href'), 
                am.find(class_='thumb').get('data-original'), 
                am.find(class_='imdb').text, 
                am.find(class_='runtime').text
                ) for am in movies.find_all('a', attrs={"oldtitle": True})],
            'tvshows': [(
                at.get('oldtitle'), 
                at.get('href'), 
                at.find(class_='thumb').get('data-original'), 
                at.find(class_='imdb').text, 
                (at.find(class_='mli-eps').text.removeprefix('Eps') if at.find(class_='mli-eps') else 'NaN')
                ) for at in tvshows.find_all('a', attrs={"oldtitle": True})]
            }

    def get_movie_embed(url):
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        embed_url = soup.find(id='tab1').find('iframe').get('src')
        url_parts = urlparse(embed_url)
        new_netloc: list = url_parts.netloc.split('.')
        if len(new_netloc) < 3:
            new_netloc.insert(0, 'embed')
        else:
            new_netloc[0] = 'embed'
        new_netloc_str = '.'.join(new_netloc)
        new_parts = url_parts._replace(netloc=new_netloc_str)
        formatted_embed_url = urlunparse(new_parts)
        
        resp = r.get(formatted_embed_url)
        soup = BeautifulSoup(resp.text, "html.parser")
        return soup.find(id='player_iframe').get('src')
    
    def get_movie_info(url):
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        info = {                                                                    # Safety checks to not raise error if soup.find returns None
            'name' : soup.find(itemprop='name').text.removesuffix(' Soap2Day')      if soup.find(itemprop='name') else 'NaN',
            'description' : soup.find(itemprop='description').text                  if soup.find(itemprop='description') else 'NaN',
            'director' : soup.find(itemprop='director').text                        if soup.find(itemprop='director') else 'NaN',
            'duration' : soup.find(itemprop='duration').text                        if soup.find(itemprop='duration') else 'NaN',
            'dateCreated' : soup.find(itemprop='dateCreated').text                  if soup.find(itemprop='dateCreated') else 'NaN',
            'imdb' : soup.find(class_='imdb-r').text                                if soup.find(class_='imdb-r') else 'NaN',
            'thumb' : soup.find(itemprop='image').get('src')                        if soup.find(itemprop='image') else 'NaN'
        }
        return info
    
    def get_tvshow_info(url):
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        info = {                                                                    # Safety checks to not raise error if soup.find returns None
            'name' : soup.find(itemprop='name').text.removesuffix(' Soap2Day')      if soup.find(itemprop='name') else 'NaN',
            'description' : soup.find(itemprop='description').text                  if soup.find(itemprop='description') else 'NaN',
            'director' : soup.find(itemprop='director').text                        if soup.find(itemprop='director') else 'NaN',
            'duration' : soup.find(itemprop='duration').text                        if soup.find(itemprop='duration') else 'NaN',
            'imdb' : soup.find(class_='imdb-r').text                                if soup.find(class_='imdb-r') else 'NaN',
            'thumb' : soup.find(itemprop='image').get('src')                        if soup.find(itemprop='image') else 'NaN'
        }
        return info
    
    def get_tvshow_embed(url, season, episode):
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        raw_seasons = soup.find(id='seasons').find_all(class_='tvseason')
        raw_seasons.reverse()
        episode_url = raw_seasons[season-1].find_all('a')[episode].get('href')

        resp = r.get(episode_url)
        soup = BeautifulSoup(resp.text, "html.parser")
        embed_url = soup.find(id='tab1').find('iframe').get('src')
        url_parts = urlparse(embed_url)
        new_netloc: list = url_parts.netloc.split('.')
        if len(new_netloc) < 3:
            new_netloc.insert(0, 'embed')
        else:
            new_netloc[0] = 'embed'
        new_netloc_str = '.'.join(new_netloc)
        new_parts = url_parts._replace(netloc=new_netloc_str)
        formatted_embed_url = urlunparse(new_parts)
        
        resp = r.get(formatted_embed_url)
        soup = BeautifulSoup(resp.text, "html.parser")
        return soup.find(id='player_iframe').get('src')
    
    def get_tvshow_episodes(url, season: int | list[int] | tuple[int] | None = None):
        """
        Returns all seasons with their episodes and episode data, unless season is specified, then it will just return the specified season or list of seasons
        """
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        raw_seasons = soup.find(id='seasons').find_all(class_='tvseason')
        if type(season) == type(None):
            filtered_seasons = raw_seasons
        elif type(season) == int:
            filtered_seasons = [raw_seasons[season-1]]
        elif type(season) == list or type(season) == tuple:
            filtered_seasons = [raw_seasons[i-1] for i in season if i-1 < len(raw_seasons)]
        seasons = []
        for s in filtered_seasons:
            eps = s.find_all('a')[1:]
            new_s = []
            for e in eps:
                ep_url = e.get('href')
                resp = r.get(ep_url)
                soup = BeautifulSoup(resp.text, "html.parser")
                title = soup.find(itemprop="duration").text
                try:
                    duration = soup.find_all(itemprop="duration")[1].text
                except IndexError: duration = 'NaN'
                try:
                    thumb = soup.find(class_="galeria_img").find('img').get('src')
                except AttributeError: thumb = ''
                new_s.append((title, ep_url, thumb, duration))
            seasons.append(new_s)
        return seasons
    
    def get_tvshow_season_and_episode_amounts(url):
        resp = r.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        seasons = soup.find(id='seasons').find_all(class_='tvseason')
        amounts = []
        for s in seasons:
            amounts.append(len(s.find_all('a'))-1)
        return amounts



#print(Soup2DayWrapper.get_tvshow_season_and_episode_amounts(Soup2DayWrapper.search('wednesday')['tvshows'][0][1]))
#print(Soup2DayWrapper.get_tvshow_embed(Soup2DayWrapper.search('wednesday')['tvshows'][0][1], 1, 3))

#print(Soup2DayWrapper.get_tvshow_episodes('https://ww25.soap2day.day/series/wednesday-2022/', 1))
#print(Soup2DayWrapper.search('wednesday')['tvshows'][0][1])
#print(Soup2DayWrapper.get_tvshow_episodes(Soup2DayWrapper.search('wednesday')['tvshows'][0][1], (1, 2)))

"""import flask

app = flask.Flask(__name__)


@app.route('/')
def index():
    return flask.redirect('/search')


@app.route('/watch')
def watch():
    info = Soup2DayWrapper.get_movie_info(flask.request.args.get('m'))
    return flask.render_template('movie_panel_page.html', iframe_url=Soup2DayWrapper.get_movie_embed(flask.request.args.get('m')), name = info['name'], description = info['description'], director = info['director'], runtime = info['duration'], releaseDate = info['dateCreated'], imdb = info['imdb'], thumb = info['thumb'])


@app.route('/search')
def search():
    movies = ''
    if flask.request.args.get('s'):
        search_results = Soup2DayWrapper.search(flask.request.args.get('s'))['movies']
        for r in search_results:
            movies += flask.render_template('movie_card.html', title=r[0], movie_url=f'{flask.url_for('watch')}?m={r[1]}', thumb=r[2], imdb=r[3], runtime=r[4])
    return flask.render_template('movie_search_page.html', movie_cards=movies)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000)"""





import flask

app = flask.Flask(__name__)
app.passwords = []
app.adminpass = '1234'
app.whitelist = {'tokens':[]}

def new_password(l = 8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(l))

def new_authkey(l = 20):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(l))

@app.route('/')
@app.route('/search')
def site_search():
    q = flask.request.args.get('q')
    type_ = flask.request.args.get('type')
    sort = flask.request.args.get('sort')
    movies = []
    tvshows = []
    cards = []
    cards_str = ''
    search_results = Soup2DayWrapper.search(q)

    if not type_ or type_ == 'all' or type_ == 'movie':
        movies = search_results['movies']
    if not type_ or type_ == 'all' or type_ == 'tv':
        tvshows = search_results['tvshows']
    
    for m in movies:
        cards.append((
            'Movie', # Type Badge
            m[3], # Rating
            m[0], # Title
            m[4], # Subline left
            'HD', # Subline right
            m[2], # Poster url
            f'/movie?id={m[1]}' # Detail url
        ))
    
    for t in tvshows:
        cards.append((
            'TV Show', # Type Badge
            t[3], # Rating
            t[0], # Title
            f'{t[4]} Episodes', # Subline left
            'HD', # Subline right
            t[2], # Poster url
            f'/tv?id={t[1]}' # Detail url
        ))

    # Sort the cards, defaulting to rating sorting
    #if sort == 'latest':
    #    cards = sorted(cards, key=lambda x: datetime.strptime(x[2], "%Y-%m-%d"), reverse=True)
    if not sort or sort == 'rating':
        cards = sorted(cards, key=lambda x: float(x[1]), reverse=True)
    
    for c in cards:
        cards_str += flask.render_template('card-template.html', 
                                    TYPE_BADGE=c[0], 
                                    RATING=c[1], 
                                    TITLE=c[2], 
                                    SUBLINE_LEFT=c[3], 
                                    SUBLINE_RIGHT=c[4], 
                                    POSTER_URL=c[5], 
                                    DETAIL_URL=c[6]
                                    )
    
    return flask.render_template('search.html', CARDS=cards_str)


@app.route('/movie')
def site_movie():
    mid = flask.request.args.get('id')
    mif = Soup2DayWrapper.get_movie_info(mid)
    eurl = Soup2DayWrapper.get_movie_embed(mid)
    return flask.render_template('movie.html', TITLE=mif['name'], SUBTITLE=f'{mif['dateCreated']} • ⭐ {mif['imdb']} • {mif['duration']}', BADGE1='Movie', BADGE2='HD', POSTER_URL=mif['thumb'], OVERVIEW=mif['description'], EMBED_URL=eurl)


@app.route('/tv')
def site_tv():
    tid = flask.request.args.get('id')
    tif = Soup2DayWrapper.get_tvshow_info(tid)
    tamounts = Soup2DayWrapper.get_tvshow_season_and_episode_amounts(tid)
    seasons = ''
    for i, es in enumerate(tamounts):
        seasons += flask.render_template('season-template.html', SUMMARY=f'Season {i+1} ({es} episodes)', SN=i+1, URL=tid)
    return flask.render_template('tv.html', TITLE=tif['name'], SUBTITLE=f'⭐ {tif['imdb']} • {tif['duration']}', BADGE1='TV Show', BADGE2='HD', POSTER_URL=tif['thumb'], OVERVIEW=tif['description'], SEASONS=seasons)

@app.route('/api/load_season_episodes')
def site_api_load_season_episodes():
    sn = int(flask.request.args.get('sn')) # Season number
    surl = flask.request.args.get('surl') # Season url (tid)
    episodes = Soup2DayWrapper.get_tvshow_episodes(surl, sn)[0]
    episodes_str = ''

    for i, e in enumerate(episodes):
        try:
            #em_url = Soup2DayWrapper.get_tvshow_embed(surl, sn-1, i+1)
            episodes_str += flask.render_template('episode-template.html', TITLE=f'Ep {str(i+1)} • {e[0]}', SUBTITLE=f'{e[3]}', THUMB_URL=e[2], EMBED_API_URL=f'/api/load_tvshow_embed?url={surl}&sn={sn-1}&en={i+1}')
        except:
            episodes_str += flask.render_template('episode-template.html', TITLE=f'Ep {str(i+1)} • {e[0]} • FAILED TO LOAD!', SUBTITLE=f'{e[3]}', THUMB_URL=e[2])

    return episodes_str

@app.route('/api/load_tvshow_embed')
def site_api_load_tvshow_embed():
    url = flask.request.args.get('url')
    sn = int(flask.request.args.get('sn'))
    en = int(flask.request.args.get('en'))
    em_url = Soup2DayWrapper.get_tvshow_embed(url, sn, en)
    return em_url


def save_whitelist():
    with open('whitelist.json', 'w') as f:
        json.dump(app.whitelist, f)

@app.before_request
def site_enforce_login():
    if not flask.request.cookies.get('token'):
        is_whitelisted = False
    else:
        ua = user_agents.parse(flask.request.user_agent.string)
        token = flask.request.cookies.get('token')
        is_whitelisted = token in app.whitelist['tokens']

    if not flask.request.path in ['/authenticate', '/admin']:
        if not is_whitelisted:
            return flask.redirect('/authenticate')
    if flask.request.path == '/authenticate' and is_whitelisted:
        return flask.redirect('/')
            
    
@app.route('/authenticate', methods=['GET', 'POST'])
def site_authenticate():
    if flask.request.method == "POST":
        if flask.request.form.get('password') in app.passwords:
            app.passwords.remove(flask.request.form.get('password'))
            #app.whitelist['tokens'].append(flask.request.remote_addr)

            token = new_authkey(20)
            hashed_token = hashlib.sha256(token.encode()).hexdigest()

            app.whitelist['tokens'].append(token)

            response = flask.redirect('/')
            response.set_cookie('token', token, httponly=True)

            save_whitelist()
            return response
        return flask.redirect('/authenticate')

    elif flask.request.method == "GET":
        return flask.render_template('authenticate.html')


@app.route('/admin', methods=['GET', 'POST'])
def site_admin_password():
    if not (flask.request.args.get('p') == app.adminpass or flask.request.form.get('p') == app.adminpass):
        return flask.abort(404)

    if flask.request.method == 'POST':
        if flask.request.form.get('actiontype') == 'createnewpassword':
            app.passwords.append(new_password())
        elif flask.request.form.get('actiontype') == 'deletepassword':
            app.passwords.pop(int(flask.request.form.get('arg1'))-1)
        return flask.redirect(f'/admin?p={app.adminpass}')

    elif flask.request.method == 'GET':
        if flask.request.args.get('p') == app.adminpass:
            return flask.render_template('admin.html', PASSWORDS=''.join([f'<li>{pword}</li>' for pword in app.passwords]), ADMINPASS=app.adminpass)


@app.route('/test')
def site_test_html():
    return flask.render_template('test.html')


if __name__ == '__main__':
    with open('whitelist.json', 'r') as f:
        app.whitelist = json.load(f)
    app.run('0.0.0.0', 5000)