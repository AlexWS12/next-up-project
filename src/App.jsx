import { useEffect, useState } from 'react';

const API_KEY = 'b79f6e29d33744babc9de7c2a143cdb8';
const TOTAL_PAGES = 30;

export default function App() {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [banGenres, setBanGenres] = useState([]);
  const [banPlatforms, setBanPlatforms] = useState([]);
  const [history, setHistory] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [allPlatforms, setAllPlatforms] = useState([]);

  const fetchGames = async () => {
    const page = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40&page=${page}`
    );
    const data = await res.json();
    if (data.results?.length > 0) {
      setGames(data.results);
      extractFilterOptions(data.results);
      showRandomGame(data.results);
    }
  };

  const extractFilterOptions = (games) => {
    const genres = new Set();
    const platforms = new Set();
    games.forEach((game) => {
      game.genres?.forEach((g) => genres.add(g.name));
      game.platforms?.forEach((p) => platforms.add(p.platform.name));
    });
    setAllGenres([...genres].sort());
    setAllPlatforms([...platforms].sort());
  };

  const showRandomGame = (source = games) => {
    const filtered = source.filter((game) => {
      const genresOK = game.genres?.every((g) => !banGenres.includes(g.name));
      const platformsOK = game.platforms?.every(
        (p) => !banPlatforms.includes(p.platform.name)
      );
      return genresOK && platformsOK;
    });

    if (filtered.length === 0) {
      setCurrentGame(null);
      return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentGame(random);
    setHistory((prev) =>
      [random, ...prev.filter((g) => g.id !== random.id)].slice(0, 10)
    );
  };

  const handleBanGenre = (genre) => {
    if (!banGenres.includes(genre)) setBanGenres([...banGenres, genre]);
  };

  const handleBanPlatform = (platform) => {
    if (!banPlatforms.includes(platform))
      setBanPlatforms([...banPlatforms, platform]);
  };

  const handleUnbanGenre = (genre) => {
    setBanGenres(banGenres.filter((g) => g !== genre));
  };

  const handleUnbanPlatform = (platform) => {
    setBanPlatforms(banPlatforms.filter((p) => p !== platform));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        padding: '2rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '2rem',
        fontFamily: 'Segoe UI, sans-serif',
        overflowX: 'hidden'
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          background: 'rgba(0,0,0,0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          width: '600px',
          boxShadow: '0 0 20px #000'
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>NextUp</h1>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => showRandomGame()}
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '1rem',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Discover New Game
          </button>
        </div>

        {currentGame ? (
          <div style={{ textAlign: 'center' }}>
            <h2>{currentGame.name}</h2>
            {currentGame.background_image && (
              <img
                src={currentGame.background_image}
                alt={currentGame.name}
                style={{
                  width: '90%',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  border: '2px solid white'
                }}
              />
            )}
            <p><strong>Release Date:</strong> {currentGame.released}</p>

            <p><strong>Genres:</strong>{' '}
              {currentGame.genres?.map((g) => (
                <span
                  key={g.id}
                  onClick={() => handleBanGenre(g.name)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#8cf',
                    marginRight: '10px'
                  }}
                >
                  {g.name}
                </span>
              ))}
            </p>

            <p><strong>Platforms:</strong>{' '}
              {currentGame.platforms?.map((p) => (
                <span
                  key={p.platform.id}
                  onClick={() => handleBanPlatform(p.platform.name)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#afa',
                    marginRight: '10px'
                  }}
                >
                  {p.platform.name}
                </span>
              ))}
            </p>
          </div>
        ) : (
          <p>No more games match your filters. Remove some bans to continue.</p>
        )}

        <hr style={{ margin: '2rem 0', borderColor: '#333' }} />

        <h2>Banned Genres</h2>
        {banGenres.length === 0 ? <p>None</p> : (
          <ul>{banGenres.map((g) => (
            <li key={g}>{g} <button onClick={() => handleUnbanGenre(g)}>❌</button></li>
          ))}</ul>
        )}

        <h2>Banned Platforms</h2>
        {banPlatforms.length === 0 ? <p>None</p> : (
          <ul>{banPlatforms.map((p) => (
            <li key={p}>{p} <button onClick={() => handleUnbanPlatform(p)}>❌</button></li>
          ))}</ul>
        )}

        <hr style={{ margin: '2rem 0', borderColor: '#333' }} />

        <h2>Viewed Game History</h2>
        {history.length === 0 ? <p>None</p> : (
          <ul>{history.map((g) => (
            <li key={g.id}>{g.name} ({g.released})</li>
          ))}</ul>
        )}
      </div>

      {/* Right Panel */}
      <div
        style={{
          background: 'rgba(0,0,0,0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          width: '300px',
          overflowY: 'auto',
          maxHeight: '90vh',
          boxShadow: '0 0 20px #000'
        }}
      >
        <h2>Ban From List</h2>

        <h3>Genres</h3>
        <ul>
          {allGenres.map((g) => (
            <li key={g}><button onClick={() => handleBanGenre(g)}>{g}</button></li>
          ))}
        </ul>

        <h3>Platforms</h3>
        <ul>
          {allPlatforms.map((p) => (
            <li key={p}><button onClick={() => handleBanPlatform(p)}>{p}</button></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
