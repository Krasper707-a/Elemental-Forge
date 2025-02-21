import React, { useState, useEffect } from 'react';
import { Flame, Droplets, Mountain, Wind, FlaskRound, Scroll, Crown, Zap, Brain, Sparkles, Atom, Star, Save, Download, BookOpen, X, ChevronRight, Beaker, Infinity, Shield, Sword, Wand, Compass } from 'lucide-react';

interface Element {
  name: string;
  count: number;
  basePerClick: number;
  perSecond: number;
  icon: React.ReactNode;
  color: string;
  isBase?: boolean;
}

interface Combination {
  result: string;
  ingredients: [string, string];
  cost: number;
}

interface Upgrade {
  id: string;
  name: string;
  cost: { element: string; amount: number }[];
  description: string;
  purchased: boolean;
  multiplier: number;
  type: 'production' | 'automation' | 'synergy';
}

interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  branch: 'elemental' | 'production' | 'alchemy' | 'mastery';
  icon: React.ReactNode;
  position: { x: number; y: number };
  requires: string[];
  unlocked: boolean;
  effects: {
    elementMultiplier?: number;
    productionMultiplier?: number;
    alchemyBonus?: number;
  };
}

interface GameState {
  elements: Record<string, Element>;
  upgrades: Upgrade[];
  skillNodes: SkillNode[];
  selectedElement: string;
  totalClicks: number;
  alchemyPoints: number;
}

interface Tutorial {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  trigger: {
    type: 'clicks' | 'elements' | 'upgrades' | 'skills';
    condition: number;
  };
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Record<string, Element>>({
    fire: {
      name: 'Fire',
      count: 0,
      basePerClick: 1,
      perSecond: 0,
      icon: <Flame className="w-6 h-6" />,
      color: 'text-red-500',
      isBase: true
    },
    water: {
      name: 'Water',
      count: 0,
      basePerClick: 1,
      perSecond: 0,
      icon: <Droplets className="w-6 h-6" />,
      color: 'text-blue-500',
      isBase: true
    },
    earth: {
      name: 'Earth',
      count: 0,
      basePerClick: 1,
      perSecond: 0,
      icon: <Mountain className="w-6 h-6" />,
      color: 'text-amber-700',
      isBase: true
    },
    air: {
      name: 'Air',
      count: 0,
      basePerClick: 1,
      perSecond: 0,
      icon: <Wind className="w-6 h-6" />,
      color: 'text-sky-300',
      isBase: true
    },
    steam: {
      name: 'Steam',
      count: 0,
      basePerClick: 0,
      perSecond: 0,
      icon: <Wind className="w-6 h-6" />,
      color: 'text-blue-200'
    },
    lava: {
      name: 'Lava',
      count: 0,
      basePerClick: 0,
      perSecond: 0,
      icon: <Flame className="w-6 h-6" />,
      color: 'text-orange-500'
    },
    metal: {
      name: 'Metal',
      count: 0,
      basePerClick: 0,
      perSecond: 0,
      icon: <Shield className="w-6 h-6" />,
      color: 'text-gray-400'
    },
    crystal: {
      name: 'Crystal',
      count: 0,
      basePerClick: 0,
      perSecond: 0,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'text-purple-300'
    }
  });

  const combinations: Combination[] = [
    { result: 'steam', ingredients: ['fire', 'water'], cost: 5 },
    { result: 'lava', ingredients: ['fire', 'earth'], cost: 10 },
    { result: 'metal', ingredients: ['earth', 'fire'], cost: 15 },
    { result: 'crystal', ingredients: ['earth', 'water'], cost: 20 }
  ];

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'basic_homunculus',
      name: 'Basic Homunculus',
      cost: [{ element: 'fire', amount: 10 }, { element: 'earth', amount: 10 }],
      description: 'Creates 0.1 of each base element per second',
      purchased: false,
      multiplier: 0.1,
      type: 'automation'
    },
    {
      id: 'elemental_resonance',
      name: 'Elemental Resonance',
      cost: [
        { element: 'fire', amount: 25 },
        { element: 'water', amount: 25 },
        { element: 'earth', amount: 25 },
        { element: 'air', amount: 25 }
      ],
      description: 'Increases all element production by 50%',
      purchased: false,
      multiplier: 1.5,
      type: 'production'
    },
    {
      id: 'advanced_homunculus',
      name: 'Advanced Homunculus',
      cost: [
        { element: 'fire', amount: 50 },
        { element: 'earth', amount: 50 }
      ],
      description: 'Creates 0.2 of each base element per second',
      purchased: false,
      multiplier: 0.2,
      type: 'automation'
    },
    {
      id: 'elemental_mastery',
      name: 'Elemental Mastery',
      cost: [
        { element: 'fire', amount: 100 },
        { element: 'water', amount: 100 }
      ],
      description: 'Doubles click production',
      purchased: false,
      multiplier: 2,
      type: 'production'
    },
    {
      id: 'fire_water_synergy',
      name: 'Fire-Water Synergy',
      cost: [
        { element: 'fire', amount: 75 },
        { element: 'water', amount: 75 }
      ],
      description: 'Fire and Water production boost each other by 25%',
      purchased: false,
      multiplier: 1.25,
      type: 'synergy'
    },
    {
      id: 'earth_air_harmony',
      name: 'Earth-Air Harmony',
      cost: [
        { element: 'earth', amount: 75 },
        { element: 'air', amount: 75 }
      ],
      description: 'Earth and Air production boost each other by 25%',
      purchased: false,
      multiplier: 1.25,
      type: 'synergy'
    }
  ]);

  const [tutorials] = useState<Tutorial[]>([
    {
      id: 'welcome',
      title: 'Welcome to Elemental Forge',
      content: 'Click the Forge button to start generating elements. Each click produces the selected element.',
      completed: false,
      trigger: { type: 'clicks', condition: 0 }
    },
    {
      id: 'elements',
      title: 'Element Selection',
      content: 'Click on different element cards to switch your active element. Each element has unique properties and synergies.',
      completed: false,
      trigger: { type: 'clicks', condition: 5 }
    },
    {
      id: 'combinations',
      title: 'Element Combinations',
      content: 'Combine base elements to create new materials! Open the Alchemy Grid to start experimenting with combinations.',
      completed: false,
      trigger: { type: 'elements', condition: 10 }
    },
    {
      id: 'upgrades',
      title: 'Upgrades System',
      content: 'Purchase upgrades to increase your production. Look for synergies between different elements!',
      completed: false,
      trigger: { type: 'elements', condition: 20 }
    },
    {
      id: 'skills',
      title: 'Skill Tree',
      content: 'Unlock powerful abilities in the skill tree using Alchemy Points (AP). Choose your path wisely!',
      completed: false,
      trigger: { type: 'upgrades', condition: 1 }
    }
  ]);

  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([
    {
      id: 'elemental_affinity',
      name: 'Elemental Affinity',
      description: 'Increase all element production by 25%',
      cost: 1,
      branch: 'elemental',
      icon: <Sparkles className="w-5 h-5" />,
      position: { x: 0, y: 0 },
      requires: [],
      unlocked: false,
      effects: { elementMultiplier: 1.25 }
    },
    {
      id: 'elemental_mastery',
      name: 'Elemental Mastery',
      description: 'Further increase element production by 50%',
      cost: 2,
      branch: 'elemental',
      icon: <Flame className="w-5 h-5" />,
      position: { x: 0, y: 1 },
      requires: ['elemental_affinity'],
      unlocked: false,
      effects: { elementMultiplier: 1.5 }
    },
    {
      id: 'elemental_harmony',
      name: 'Elemental Harmony',
      description: 'All elements boost each other\'s production',
      cost: 3,
      branch: 'elemental',
      icon: <Infinity className="w-5 h-5" />,
      position: { x: 0, y: 2 },
      requires: ['elemental_mastery'],
      unlocked: false,
      effects: { elementMultiplier: 2 }
    },
    {
      id: 'production_mastery',
      name: 'Production Mastery',
      description: 'Increase per-click production by 50%',
      cost: 1,
      branch: 'production',
      icon: <Zap className="w-5 h-5" />,
      position: { x: 1, y: 0 },
      requires: [],
      unlocked: false,
      effects: { productionMultiplier: 1.5 }
    },
    {
      id: 'rapid_production',
      name: 'Rapid Production',
      description: 'Double click production speed',
      cost: 2,
      branch: 'production',
      icon: <Sword className="w-5 h-5" />,
      position: { x: 1, y: 1 },
      requires: ['production_mastery'],
      unlocked: false,
      effects: { productionMultiplier: 2 }
    },
    {
      id: 'production_overflow',
      name: 'Production Overflow',
      description: 'Chance to get bonus elements on click',
      cost: 3,
      branch: 'production',
      icon: <Beaker className="w-5 h-5" />,
      position: { x: 1, y: 2 },
      requires: ['rapid_production'],
      unlocked: false,
      effects: { productionMultiplier: 2.5 }
    }
  ]);

  const [selectedElement, setSelectedElement] = useState<string>('fire');
  const [totalClicks, setTotalClicks] = useState(0);
  const [showAlchemyGrid, setShowAlchemyGrid] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [alchemyPoints, setAlchemyPoints] = useState(5);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const savedGame = localStorage.getItem('elementalForgeGame');
    if (savedGame) {
      const gameState: GameState = JSON.parse(savedGame);
      setElements(prevElements => {
        const loadedElements = { ...gameState.elements };
        Object.keys(loadedElements).forEach(key => {
          loadedElements[key].icon = prevElements[key].icon;
        });
        return loadedElements;
      });
      setUpgrades(gameState.upgrades);
      setSkillNodes(prevNodes => {
        const loadedNodes = [...gameState.skillNodes];
        loadedNodes.forEach((node, index) => {
          node.icon = prevNodes[index].icon;
        });
        return loadedNodes;
      });
      setSelectedElement(gameState.selectedElement);
      setTotalClicks(gameState.totalClicks);
      setAlchemyPoints(gameState.alchemyPoints);
    }

    const timer = setInterval(() => {
      setElements(prev => {
        const newElements = { ...prev };
        Object.keys(newElements).forEach(key => {
          newElements[key].count += newElements[key].perSecond;
        });
        return newElements;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saveTimer = setInterval(saveGame, 30000);
    return () => clearInterval(saveTimer);
  }, [elements, upgrades, skillNodes, selectedElement, totalClicks, alchemyPoints]);

  const saveGame = () => {
    const gameState: GameState = {
      elements,
      upgrades,
      skillNodes,
      selectedElement,
      totalClicks,
      alchemyPoints
    };
    localStorage.setItem('elementalForgeGame', JSON.stringify(gameState));
  };

  const handleManualSave = () => {
    saveGame();
  };

  const handleElementClick = (elementKey: string) => {
    setElements(prev => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        count: prev[elementKey].count + prev[elementKey].basePerClick
      }
    }));
    setTotalClicks(prev => prev + 1);
  };

  const handleIngredientClick = (element: string) => {
    if (!elements[element].isBase) return;
    
    if (selectedIngredients.includes(element)) {
      setSelectedIngredients(prev => prev.filter(e => e !== element));
    } else if (selectedIngredients.length < 2) {
      setSelectedIngredients(prev => [...prev, element]);
    }
  };

  const canCombine = () => {
    if (selectedIngredients.length !== 2) return false;
    
    const combination = combinations.find(
      c => c.ingredients.every(i => selectedIngredients.includes(i))
    );
    
    if (!combination) return false;
    
    return selectedIngredients.every(
      ingredient => elements[ingredient].count >= combination.cost
    );
  };

  const handleCombine = () => {
    if (!canCombine()) return;
    
    const combination = combinations.find(
      c => c.ingredients.every(i => selectedIngredients.includes(i))
    );
    
    if (!combination) return;
    
    setElements(prev => {
      const newElements = { ...prev };
      selectedIngredients.forEach(ingredient => {
        newElements[ingredient].count -= combination.cost;
      });
      newElements[combination.result].count += 1;
      return newElements;
    });
    
    setSelectedIngredients([]);
  };

  const canPurchaseUpgrade = (upgrade: Upgrade) => {
    return upgrade.cost.every(cost => 
      elements[cost.element].count >= cost.amount
    );
  };

  const purchaseUpgrade = (upgrade: Upgrade) => {
    if (!canPurchaseUpgrade(upgrade)) return;

    setElements(prev => {
      const newElements = { ...prev };
      upgrade.cost.forEach(cost => {
        newElements[cost.element].count -= cost.amount;
      });
      
      if (upgrade.type === 'automation') {
        Object.keys(newElements).forEach(key => {
          if (newElements[key].isBase) {
            newElements[key].perSecond += upgrade.multiplier;
          }
        });
      } else if (upgrade.type === 'production') {
        Object.keys(newElements).forEach(key => {
          if (newElements[key].isBase) {
            newElements[key].basePerClick *= upgrade.multiplier;
            newElements[key].perSecond *= upgrade.multiplier;
          }
        });
      } else if (upgrade.type === 'synergy') {
        if (upgrade.id === 'fire_water_synergy') {
          newElements.fire.basePerClick *= upgrade.multiplier;
          newElements.water.basePerClick *= upgrade.multiplier;
          newElements.fire.perSecond *= upgrade.multiplier;
          newElements.water.perSecond *= upgrade.multiplier;
        } else if (upgrade.id === 'earth_air_harmony') {
          newElements.earth.basePerClick *= upgrade.multiplier;
          newElements.air.basePerClick *= upgrade.multiplier;
          newElements.earth.perSecond *= upgrade.multiplier;
          newElements.air.perSecond *= upgrade.multiplier;
        }
      }
      
      return newElements;
    });

    setUpgrades(prev => 
      prev.map(u => u.id === upgrade.id ? { ...u, purchased: true } : u)
    );
  };

  const canUnlockSkill = (skill: SkillNode) => {
    if (skill.unlocked) return false;
    if (alchemyPoints < skill.cost) return false;
    return skill.requires.every(reqId => 
      skillNodes.find(node => node.id === reqId)?.unlocked
    );
  };

  const unlockSkill = (skillId: string) => {
    const skill = skillNodes.find(node => node.id === skillId);
    if (!skill || !canUnlockSkill(skill)) return;

    setAlchemyPoints(prev => prev - skill.cost);
    setSkillNodes(prev => 
      prev.map(node => node.id === skillId ? { ...node, unlocked: true } : node)
    );

    if (skill.effects.elementMultiplier || skill.effects.productionMultiplier) {
      setElements(prev => {
        const newElements = { ...prev };
        Object.keys(newElements).forEach(key => {
          if (skill.effects.elementMultiplier) {
            newElements[key].basePerClick *= skill.effects.elementMultiplier;
            newElements[key].perSecond *= skill.effects.elementMultiplier;
          }
          if (skill.effects.productionMultiplier) {
            newElements[key].basePerClick *= skill.effects.productionMultiplier;
          }
        });
        return newElements;
      });
    }
  };

  const renderTutorial = () => {
    if (!showTutorial || currentTutorial >= tutorials.length) return null;
    
    const tutorial = tutorials[currentTutorial];
    
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-gray-800/95 rounded-lg p-4 border border-purple-500/20 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {tutorial.title}
          </h3>
          <button
            onClick={() => setShowTutorial(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-300 mb-4">{tutorial.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            Tip {currentTutorial + 1} of {tutorials.length}
          </span>
          <button
            onClick={() => setCurrentTutorial(prev => prev + 1)}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-gray-900 text-white">
      <header className="p-4 text-center border-b border-purple-700/30">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Elemental Forge: The Alchemist's Clicker
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManualSave}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Game
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-2">
          <p className="text-purple-300">Total Clicks: {totalClicks}</p>
          <p className="text-yellow-300 flex items-center gap-1">
            <Atom className="w-4 h-4" /> AP: {alchemyPoints}
          </p>
        </div>
      </header>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(elements).map(([key, element]) => (
              <div
                key={key}
                className={`p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all
                          ${selectedElement === key ? 'ring-2 ring-purple-500' : ''}
                          ${selectedIngredients.includes(key) ? 'ring-2 ring-yellow-500' : ''}`}
                onClick={() => element.isBase ? setSelectedElement(key) : null}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className={`flex items-center gap-2 ${element.color}`}>
                    {element.icon}
                    <span className="font-semibold">{element.name}</span>
                  </div>
                  <span className="text-sm opacity-80">
                    {element.count.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {element.isBase && (
                    <>
                      Per Click: {element.basePerClick.toFixed(1)}
                      <br />
                    </>
                  )}
                  Per Second: {element.perSecond.toFixed(1)}
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full p-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                     transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-purple-500/20"
            onClick={() => handleElementClick(selectedElement)}
          >
            <div className="flex flex-col items-center gap-2">
              <FlaskRound className="w-12 h-12" />
              <span className="text-xl font-bold">Forge {elements[selectedElement].name}</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 border border-purple-500/20
                       hover:border-purple-500/40 transition-all"
              onClick={() => setShowAlchemyGrid(!showAlchemyGrid)}
            >
              <div className="flex items-center justify-center gap-2">
                <Scroll className="w-6 h-6" />
                <span>Toggle Alchemy Grid</span>
              </div>
            </button>

            <button
              className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 border border-purple-500/20
                       hover:border-purple-500/40 transition-all"
              onClick={() => setShowSkillTree(!showSkillTree)}
            >
              <div className="flex items-center justify-center gap-2">
                <Brain className="w-6 h-6" />
                <span>Skill Tree</span>
              </div>
            </button>
          </div>

          {showAlchemyGrid && (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Scroll className="w-6 h-6 text-purple-400" />
                Alchemy Grid
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-300">Selected Ingredients:</h3>
                  <div className="flex gap-2">
                    {selectedIngredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded bg-gray-700/50 ${elements[ingredient].color}`}
                      >
                        {elements[ingredient].name}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={`p-2 rounded-lg ${
                    canCombine()
                      ? 'bg-purple-600 hover:bg-purple-500'
                      : 'bg-gray-700 cursor-not-allowed'
                  } transition-colors`}
                  onClick={handleCombine}
                  disabled={!canCombine()}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Beaker className="w-5 h-5" />
                    <span>Combine Elements</span>
                  </div>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(elements)
                  .filter(([_, element]) => element.isBase)
                  .map(([key, element]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg bg-gray-700/50 cursor-pointer
                                ${selectedIngredients.includes(key) ? 'ring-2 ring-yellow-500' : ''}`}
                      onClick={() => handleIngredientClick(key)}
                    >
                      <div className={`flex items-center gap-2 ${element.color}`}>
                        {element.icon}
                        <span>{element.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <h3 className="font-semibold mb-2">Available Combinations:</h3>
                <ul className="space-y-1">
                  {combinations.map((combo, index) => (
                    <li key={index}>
                      {elements[combo.ingredients[0]].name} + {elements[combo.ingredients[1]].name} →{' '}
                      {elements[combo.result].name} (Cost: {combo.cost} each)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {showSkillTree && (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Alchemical Mastery
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {skillNodes.map(skill => (
                  <div
                    key={skill.id}
                    className={`p-4 rounded-lg ${
                      skill.unlocked
                        ? 'bg-purple-900/60'
                        : canUnlockSkill(skill)
                        ? 'bg-purple-800/40 hover:bg-purple-700/40 cursor-pointer'
                        : 'bg-gray-800/40 opacity-50'
                    } transition-all`}
                    onClick={() => !skill.unlocked && unlockSkill(skill.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {skill.icon}
                      <span className="font-semibold">{skill.name}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
                    {!skill.unlocked && (
                      <p className="text-sm text-yellow-300">Cost: {skill.cost} AP</p>
                    )}
                    {skill.requires.length > 0 && !skill.unlocked && (
                      <p className="text-xs text-gray-400 mt-1">
                        Requires: {skill.requires.map(req => 
                          skillNodes.find(node => node.id === req)?.name
                        ).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-purple-500/20"> <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Upgrades</h2>
          </div>
          <div className="space-y-4">
            {upgrades.filter(u => !u.purchased).map(upgrade => (
              <div
                key={upgrade.id}
                className={`p-4 rounded-lg ${
                  canPurchaseUpgrade(upgrade)
                    ? 'bg-purple-900/40 hover:bg-purple-800/40 cursor-pointer'
                    : 'bg-gray-800/40 opacity-75'
                } transition-all`}
                onClick={() => purchaseUpgrade(upgrade)}
              >
                <h3 className="font-semibold mb-1">{upgrade.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{upgrade.description}</p>
                <div className="text-sm">
                  Cost:
                  {upgrade.cost.map((cost, i) => (
                    <span key={i} className="ml-2">
                      {cost.amount} {elements[cost.element].name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderTutorial()}
    </div>
  );
};

export default App;