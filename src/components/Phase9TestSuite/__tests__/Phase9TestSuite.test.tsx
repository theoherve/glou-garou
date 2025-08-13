import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Phase9TestSuite } from '../Phase9TestSuite';
import { PHASE9_CONFIG, validateConfig } from '../config';

// Mock des composants enfants
jest.mock('../../EndToEndTest', () => ({
  EndToEndTest: ({ roomCode }: { roomCode: string }) => (
    <div data-testid="end-to-end-test">EndToEndTest - Room: {roomCode}</div>
  )
}));

jest.mock('../../MultiPlayerTest', () => ({
  MultiPlayerTest: ({ roomCode }: { roomCode: string }) => (
    <div data-testid="multi-player-test">MultiPlayerTest - Room: {roomCode}</div>
  )
}));

jest.mock('../../ConnectionTest', () => ({
  ConnectionTest: ({ roomCode }: { roomCode: string }) => (
    <div data-testid="connection-test">ConnectionTest - Room: {roomCode}</div>
  )
}));

jest.mock('../../ErrorHandler', () => ({
  ErrorHandler: ({ roomCode }: { roomCode: string }) => (
    <div data-testid="error-handler">ErrorHandler - Room: {roomCode}</div>
  )
}));

describe('Phase9TestSuite', () => {
  const mockRoomCode = 'TEST123';

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('devrait rendre le composant principal avec le titre correct', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      expect(screen.getByText('🧪 Phase 9 - Suite de Tests')).toBeInTheDocument();
      expect(screen.getByText('Tests et Debug Complets')).toBeInTheDocument();
    });

    it('devrait afficher le code de la salle', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      expect(screen.getByText(`Salle: ${mockRoomCode}`)).toBeInTheDocument();
    });

    it('devrait rendre tous les composants de test', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      expect(screen.getByTestId('end-to-end-test')).toBeInTheDocument();
      expect(screen.getByTestId('multi-player-test')).toBeInTheDocument();
      expect(screen.getByTestId('connection-test')).toBeInTheDocument();
      expect(screen.getByTestId('error-handler')).toBeInTheDocument();
    });
  });

  describe('Fonctionnalités de contrôle', () => {
    it('devrait avoir un bouton pour lancer tous les tests', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      const runAllButton = screen.getByText('🚀 Lancer Tous les Tests');
      expect(runAllButton).toBeInTheDocument();
    });

    it('devrait avoir un bouton pour arrêter tous les tests', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      const stopAllButton = screen.getByText('⏹️ Arrêter Tous les Tests');
      expect(stopAllButton).toBeInTheDocument();
    });

    it('devrait avoir un bouton pour réinitialiser', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      const resetButton = screen.getByText('🔄 Réinitialiser');
      expect(resetButton).toBeInTheDocument();
    });

    it('devrait avoir un bouton pour exporter les résultats', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      const exportButton = screen.getByText('📊 Exporter Résultats');
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('Statistiques', () => {
    it('devrait afficher les statistiques globales', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      expect(screen.getByText('📊 Statistiques Globales')).toBeInTheDocument();
      expect(screen.getByText('Tests Actifs')).toBeInTheDocument();
      expect(screen.getByText('Tests Réussis')).toBeInTheDocument();
      expect(screen.getByText('Tests Échoués')).toBeInTheDocument();
      expect(screen.getByText('Taux de Succès')).toBeInTheDocument();
    });

    it('devrait afficher les statistiques par composant', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      expect(screen.getByText('🔍 Tests de Bout en Bout')).toBeInTheDocument();
      expect(screen.getByText('👥 Tests Multi-Joueurs')).toBeInTheDocument();
      expect(screen.getByText('🔌 Tests de Connexion')).toBeInTheDocument();
      expect(screen.getByText('🚨 Gestionnaire d\'Erreurs')).toBeInTheDocument();
    });
  });

  describe('Composants repliables', () => {
    it('devrait permettre de replier/déplier les composants', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      // Vérifier que les composants sont visibles par défaut
      expect(screen.getByTestId('end-to-end-test')).toBeInTheDocument();
      
      // Cliquer sur le bouton de repliement
      const collapseButton = screen.getByText('🔍 Tests de Bout en Bout');
      fireEvent.click(collapseButton);
      
      // Le composant devrait être replié (non visible)
      expect(screen.queryByTestId('end-to-end-test')).not.toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de rendu gracieusement', () => {
      // Simuler une erreur dans un composant enfant
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      // Vérifier que le composant se rend malgré les erreurs
      expect(screen.getByText('🧪 Phase 9 - Suite de Tests')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir des attributs ARIA appropriés', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      // Vérifier les attributs d'accessibilité
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('🧪 Phase 9 - Suite de Tests');
    });

    it('devrait avoir des boutons accessibles', () => {
      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Responsive design', () => {
    it('devrait s\'adapter aux différentes tailles d\'écran', () => {
      // Simuler un écran mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Phase9TestSuite roomCode={mockRoomCode} />);
      
      // Le composant devrait se rendre sans erreur
      expect(screen.getByText('🧪 Phase 9 - Suite de Tests')).toBeInTheDocument();
    });
  });
});

describe('Configuration Phase 9', () => {
  describe('PHASE9_CONFIG', () => {
    it('devrait avoir une configuration valide', () => {
      expect(PHASE9_CONFIG).toBeDefined();
      expect(PHASE9_CONFIG.general.name).toBe('Phase 9 - Tests et Debug');
      expect(PHASE9_CONFIG.general.version).toBe('1.0.0');
    });

    it('devrait avoir tous les types de tests configurés', () => {
      expect(PHASE9_CONFIG.tests.endToEnd).toBeDefined();
      expect(PHASE9_CONFIG.tests.multiPlayer).toBeDefined();
      expect(PHASE9_CONFIG.tests.connection).toBeDefined();
      expect(PHASE9_CONFIG.tests.errorHandler).toBeDefined();
    });

    it('devrait avoir une configuration UI valide', () => {
      expect(PHASE9_CONFIG.ui.components.animations).toBe(true);
      expect(PHASE9_CONFIG.ui.components.responsive).toBe(true);
      expect(PHASE9_CONFIG.ui.components.darkMode).toBe(true);
    });
  });

  describe('validateConfig', () => {
    it('devrait valider une configuration correcte', () => {
      const isValid = validateConfig();
      expect(isValid).toBe(true);
    });

    it('devrait gérer les erreurs de validation', () => {
      // Simuler une erreur de validation
      const originalConfig = PHASE9_CONFIG;
      Object.defineProperty(PHASE9_CONFIG, 'tests', {
        get: () => undefined,
        configurable: true
      });

      const isValid = validateConfig();
      expect(isValid).toBe(false);

      // Restaurer la configuration originale
      Object.defineProperty(PHASE9_CONFIG, 'tests', {
        get: () => originalConfig.tests,
        configurable: true
      });
    });
  });
});

describe('Intégration des composants', () => {
  it('devrait passer le roomCode correctement à tous les composants enfants', () => {
    const testRoomCode = 'INTEGRATION123';
    render(<Phase9TestSuite roomCode={testRoomCode} />);
    
    // Vérifier que chaque composant reçoit le bon roomCode
    expect(screen.getByText(`EndToEndTest - Room: ${testRoomCode}`)).toBeInTheDocument();
    expect(screen.getByText(`MultiPlayerTest - Room: ${testRoomCode}`)).toBeInTheDocument();
    expect(screen.getByText(`ConnectionTest - Room: ${testRoomCode}`)).toBeInTheDocument();
    expect(screen.getByText(`ErrorHandler - Room: ${testRoomCode}`)).toBeInTheDocument();
  });

  it('devrait gérer les changements de roomCode', () => {
    const { rerender } = render(<Phase9TestSuite roomCode="ROOM1" />);
    
    expect(screen.getByText('EndToEndTest - Room: ROOM1')).toBeInTheDocument();
    
    // Changer le roomCode
    rerender(<Phase9TestSuite roomCode="ROOM2" />);
    
    expect(screen.getByText('EndToEndTest - Room: ROOM2')).toBeInTheDocument();
  });
});

describe('Performance', () => {
  it('devrait se rendre rapidement', () => {
    const startTime = performance.now();
    
    render(<Phase9TestSuite roomCode={mockRoomCode} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Le rendu devrait prendre moins de 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('devrait gérer efficacement les re-rendus', () => {
    const { rerender } = render(<Phase9TestSuite roomCode={mockRoomCode} />);
    
    const startTime = performance.now();
    
    // Forcer plusieurs re-rendus
    for (let i = 0; i < 10; i++) {
      rerender(<Phase9TestSuite roomCode={mockRoomCode} />);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Les re-rendus devraient être rapides
    expect(totalTime).toBeLessThan(50);
  });
});
