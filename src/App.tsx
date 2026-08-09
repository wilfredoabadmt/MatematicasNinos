import React, { useState, useEffect } from 'react';
import { GameMode, Difficulty, Screen, PlayerProfile } from './types';
import { Hero, heroes } from './data/heroes';
import { initVoices, startBackgroundMusic, setMusicEnabled } from './utils/speech';
import SplashScreen from './components/SplashScreen';
import HeroSelect from './components/HeroSelect';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import DinoPuzzleModal from './components/DinoPuzzleModal';
import PlayerRegistrationModal from './components/PlayerRegistrationModal';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedHero, setSelectedHero] = useState<Hero>(heroes[0]);
  const [gameMode, setGameMode] = useState<GameMode>('suma');
  const [difficulty, setDifficulty] = useState<Difficulty>('facil');
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [showPuzzle, setShowPuzzle] = useState<boolean>(false);
  const [showRegModal, setShowRegModal] = useState<boolean>(false);

  // Perfiles de Jugador (Nombre y Apellido)
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => {
    const saved = localStorage.getItem('dino_math_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (_e) {}
    }
    return [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem('dino_math_active_profile_id') || null;
  });

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || null;

  useEffect(() => {
    localStorage.setItem('dino_math_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('dino_math_active_profile_id', activeProfileId);
    }
  }, [activeProfileId]);

  const activityEggs = activeProfile?.activityEggs || { suma: 0, resta: 0, multiplicacion: 0, division: 0, completar: 0, comparar: 0 };
  const totalStars = activeProfile?.totalStars || 0;
  const totalEggs = Object.values(activityEggs).reduce((a, b) => a + b, 0);

  const handleSaveProfile = (firstName: string, lastName: string) => {
    const existing = profiles.find(p => p.firstName.toLowerCase() === firstName.toLowerCase() && p.lastName.toLowerCase() === lastName.toLowerCase());
    if (existing) {
      setActiveProfileId(existing.id);
    } else {
      const newProfile: PlayerProfile = {
        id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        firstName,
        lastName,
        totalStars: 0,
        activityEggs: { suma: 0, resta: 0, multiplicacion: 0, division: 0, completar: 0, comparar: 0 },
        unlockedRewards: [],
        createdAt: new Date().toISOString(),
      };
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    }
    setShowRegModal(false);
    setScreen('heroSelect');
  };

  const handleSelectExistingProfile = (p: PlayerProfile) => {
    setActiveProfileId(p.id);
    setShowRegModal(false);
    setScreen('menu');
  };

  const handleAddEgg = (mode: GameMode) => {
    if (!activeProfile) return;
    setProfiles(prev => prev.map(p => {
      if (p.id !== activeProfile.id) return p;
      const current = p.activityEggs[mode] || 0;
      if (current >= 5) return p;
      return {
        ...p,
        activityEggs: { ...p.activityEggs, [mode]: current + 1 },
      };
    }));
  };

  const handleAddStars = (stars: number) => {
    if (!activeProfile) return;
    setProfiles(prev => prev.map(p => {
      if (p.id !== activeProfile.id) return p;
      return { ...p, totalStars: p.totalStars + stars };
    }));
  };

  useEffect(() => {
    initVoices();
  }, []);

  const toggleMusic = () => {
    const nextState = !musicOn;
    setMusicOn(nextState);
    setMusicEnabled(nextState);
  };

  const handleUserInteraction = () => {
    if (musicOn) {
      startBackgroundMusic();
    }
  };

  const handleSelectHero = (hero: Hero) => {
    handleUserInteraction();
    setSelectedHero(hero);
    setScreen('menu');
  };

  const handleStartGame = (mode: GameMode, diff: Difficulty) => {
    handleUserInteraction();
    setGameMode(mode);
    setDifficulty(diff);
    setScreen('game');
  };

  const handleBackToMenu = () => {
    handleUserInteraction();
    setScreen('menu');
  };

  return (
    <div className="relative" onClick={handleUserInteraction}>
      {/* Floating Music Control Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMusic();
        }}
        className="fixed top-3 right-3 z-50 bg-amber-400/90 hover:bg-amber-300 text-amber-950 rounded-full p-2.5 shadow-xl border-2 border-amber-200 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center text-lg"
        title={musicOn ? "Desactivar música jurásica" : "Activar música jurásica"}
      >
        {musicOn ? '🎵' : '🔇'}
      </button>

      {/* Modal de Rompecabezas */}
      {showPuzzle && (
        <DinoPuzzleModal hero={selectedHero} onClose={() => setShowPuzzle(false)} />
      )}

      {/* Modal de Registro/Cambio de Jugador */}
      {showRegModal && (
        <PlayerRegistrationModal
          onSaveProfile={handleSaveProfile}
          onSelectExistingProfile={handleSelectExistingProfile}
          existingProfiles={profiles}
          onClose={() => setShowRegModal(false)}
        />
      )}

      {screen === 'splash' && (
        <SplashScreen
          onContinue={handleSaveProfile}
          activeProfile={activeProfile}
          existingProfiles={profiles}
          onSelectExistingProfile={handleSelectExistingProfile}
        />
      )}
      {screen === 'heroSelect' && (
        <HeroSelect onSelectHero={handleSelectHero} activeProfile={activeProfile} />
      )}

      {screen === 'menu' && (
        <MainMenu
          hero={selectedHero}
          onStartGame={handleStartGame}
          onChangeHero={() => { handleUserInteraction(); setScreen('heroSelect'); }}
          totalStars={totalStars}
          activityEggs={activityEggs}
          totalEggs={totalEggs}
          onOpenPuzzle={() => setShowPuzzle(true)}
          activeProfile={activeProfile}
          onOpenRegistration={() => setShowRegModal(true)}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          mode={gameMode}
          difficulty={difficulty}
          hero={selectedHero}
          onBackToMenu={handleBackToMenu}
          onAddStars={handleAddStars}
          activityEggs={activityEggs}
          totalEggs={totalEggs}
          onAddEgg={handleAddEgg}
          onOpenPuzzle={() => setShowPuzzle(true)}
        />
      )}
    </div>
  );
};

export default App;
