// ============================================
// MOCK DATA — Premium Demonstration Data
// ============================================

export const mockAcademies = {
    'alpha': {
        id: 'academy-alpha-uuid',
        name: 'Academia Alpha',
        slug: 'alpha',
        logo_url: '/icons/icon.svg',
        primary_color: '#FF6B2C',
        secondary_color: '#FF8F5E',
        background_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=720&auto=format&fit=crop',
        max_students: 100,
        status: 'active'
    },
    'blackwave': {
        id: 'academy-blackwave-uuid',
        name: 'Black Wave Gym',
        slug: 'blackwave',
        logo_url: '/icons/icon.svg',
        primary_color: '#111111',
        secondary_color: '#8E8E93',
        background_image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=720&auto=format&fit=crop',
        max_students: 250,
        status: 'active'
    },
    'evolution': {
        id: 'academy-evolution-uuid',
        name: 'Academia Evolution',
        slug: 'evolution',
        logo_url: '/icons/icon.svg',
        primary_color: '#007AFF',
        secondary_color: '#5AC8FA',
        background_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=720&auto=format&fit=crop',
        max_students: 150,
        status: 'active'
    }
};

const detailedExercises = [
    {
        id: 'ex-1',
        name: 'Supino Reto com Barra',
        muscle_group: 'Peito',
        equipment: 'Barra',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-in-the-gym-42299-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop',
        description: 'O supino reto é um exercício clássico de treinamento com pesos que visa principalmente o músculo peitoral maior, bem como o deltoide anterior e tríceps.',
        execution_steps: [
            'Deite-se no banco plano com os pés firmemente apoiados no chão.',
            'Segure a barra com as mãos ligeiramente mais afastadas que a largura dos ombros.',
            'Retire a barra do suporte e estenda os braços verticalmente acima do peito.',
            'Desça a barra lentamente até tocar levemente a linha média do peito.',
            'Empurre a barra de volta à posição inicial, estendendo completamente os braços.'
        ],
        common_mistakes: [
            'Retirar os pés do chão durante o movimento.',
            'Bater a barra no peito para ganhar impulso.',
            'Curvar excessivamente a região lombar levantando o quadril do banco.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-2',
        name: 'Rosca Direta com Barra',
        muscle_group: 'Bíceps',
        equipment: 'Barra',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-lifting-barbell-in-gym-42297-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=150&auto=format&fit=crop',
        description: 'Um dos exercícios mais eficazes para isolamento do bíceps braquial.',
        execution_steps: [
            'Fique em pé com os pés afastados na largura dos ombros, joelhos levemente flexionados.',
            'Segure a barra com pegada supinada (palmas para cima) na largura dos ombros.',
            'Mantendo os cotovelos fixos ao lado do corpo, levante a barra em direção aos ombros.',
            'Faça uma breve pausa no topo contraindo o bíceps.',
            'Retorne a barra lentamente à posição inicial controlando a descida.'
        ],
        common_mistakes: [
            'Balançar o corpo para trás para ajudar no movimento.',
            'Afastar os cotovelos das laterais do corpo.',
            'Não estender os braços completamente na descida.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-3',
        name: 'Agachamento Livre',
        muscle_group: 'Quadríceps',
        equipment: 'Barra',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-training-legs-with-squats-in-gym-43026-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=150&auto=format&fit=crop',
        description: 'Exercício composto fundamental para o desenvolvimento de membros inferiores, fortalecendo quadríceps, glúteos e core.',
        execution_steps: [
            'Posicione a barra sobre o músculo trapézio (não no pescoço).',
            'Afaste os pés na largura dos ombros, apontando os dedos levemente para fora.',
            'Inicie o movimento empurrando o quadril para trás, como se fosse sentar em uma cadeira.',
            'Desça até que as coxas fiquem pelo menos paralelas ao chão, mantendo a coluna alinhada.',
            'Suba empurrando o chão através dos calcanhares até retornar à posição inicial.'
        ],
        common_mistakes: [
            'Deixar os joelhos desabarem para dentro (valgo dinâmico).',
            'Tirar os calcanhares do chão.',
            'Curvar a coluna lombar na parte mais baixa do movimento.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-4',
        name: 'Leg Press 45°',
        muscle_group: 'Quadríceps',
        equipment: 'Máquinas',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-man-working-out-his-legs-at-the-gym-42301-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop',
        description: 'Exercício em máquina focado no desenvolvimento de quadríceps, glúteos e isquiotibiais com excelente suporte para a coluna.',
        execution_steps: [
            'Sente-se no aparelho apoiando as costas totalmente no encosto.',
            'Posicione os pés na plataforma na largura dos ombros.',
            'Destrave a plataforma e flexione os joelhos trazendo o peso em direção ao peito até formar um ângulo de 90º.',
            'Empurre a plataforma de volta, focando a força nos calcanhares.',
            'Evite estender completamente os joelhos no final do movimento (bloqueio articular).'
        ],
        common_mistakes: [
            'Tirar a região lombar/quadril do encosto ao descer a plataforma.',
            'Esticar totalmente os joelhos (travamento articular) sob carga.',
            'Posicionar os pés muito baixos na plataforma, sobrecarregando a patela.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-5',
        name: 'Elevação Lateral',
        muscle_group: 'Ombros',
        equipment: 'Halteres',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-shoulders-with-dumbbells-in-gym-42295-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=150&auto=format&fit=crop',
        description: 'O melhor exercício isolador para o deltoide lateral, responsável pela largura dos ombros.',
        execution_steps: [
            'Segure um halter em cada mão ao lado do corpo, em pé, coluna reta.',
            'Com os cotovelos levemente flexionados, eleve os braços para as laterais.',
            'Suba os halteres até que os braços fiquem paralelos ao chão (linha do ombro).',
            'Lentamente, retorne os halteres controlando a gravidade.'
        ],
        common_mistakes: [
            'Subir os halteres acima do nível dos ombros sem girar a articulação.',
            'Balançar o corpo ou usar impulso das pernas.',
            'Manter os cotovelos completamente esticados.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-6',
        name: 'Puxada Frente Aberta',
        muscle_group: 'Costas',
        equipment: 'Máquinas',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-exercising-back-on-pulley-machine-42296-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop',
        description: 'Exercício clássico de tração vertical para o desenvolvimento do músculo grande dorsal (costas largas).',
        execution_steps: [
            'Ajuste o rolo de suporte das coxas para mantê-lo firme no banco.',
            'Segure a barra com pegada pronada aberta (palmas para frente).',
            'Puxe a barra para baixo em direção ao peito, inclinando o tronco levemente para trás.',
            'Conduza o movimento focando em puxar com os cotovelos, não com os bíceps.',
            'Estenda os braços de volta controlando o peso na subida.'
        ],
        common_mistakes: [
            'Puxar a barra por trás do pescoço (risco de lesão no ombro).',
            'Usar excesso de impulso do tronco para puxar.',
            'Não realizar a amplitude máxima de movimento.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-7',
        name: 'Tríceps Corda',
        muscle_group: 'Tríceps',
        equipment: 'Cabos',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-exercising-triceps-in-gym-43033-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=150&auto=format&fit=crop',
        description: 'Exercício de isolamento para a cabeça lateral e medial do tríceps.',
        execution_steps: [
            'Fique de frente para a polia, segurando a corda com pegada neutra.',
            'Mantenha os cotovelos fixos ao lado do corpo e as costas retas.',
            'Estenda os braços completamente empurrando as mãos para baixo.',
            'Abra as pontas da corda para fora no final do movimento para contração máxima.',
            'Retorne as mãos à posição inicial de forma lenta e controlada.'
        ],
        common_mistakes: [
            'Deixar os cotovelos se moverem para frente e para trás durante a execução.',
            'Curvar as costas jogando os ombros para a frente.',
            'Usar peso excessivo sacrificando a amplitude.'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'ex-8',
        name: 'Mesa Flexora',
        muscle_group: 'Posterior de coxa',
        equipment: 'Máquinas',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-hamstrings-on-machine-42300-large.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop',
        description: 'Excelente isolador para os músculos posteriores da coxa (isquiotibiais).',
        execution_steps: [
            'Deite-se de bruços no aparelho alinhando o joelho com o eixo de rotação.',
            'Posicione a almofada do rolo logo abaixo do músculo da panturrilha (perto do tendão de Aquiles).',
            'Segure as alças firmemente e flexione as pernas trazendo os calcanhares em direção ao glúteo.',
            'Retorne os pés lentamente, controlando a força contrária do peso.'
        ],
        common_mistakes: [
            'Elevar o quadril da mesa alinhado ao flexionar as pernas.',
            'Ajustar o rolo muito alto no tendão ou muito baixo no pé.',
            'Trancos na descida do peso.'
        ],
        difficulty: 'beginner'
    }
];

// Helper to get placeholders for generated exercises
function getPlaceholderThumb(group) {
    switch (group) {
        case 'Peito':
            return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop';
        case 'Costas':
            return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop';
        case 'Ombros':
            return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=150&auto=format&fit=crop';
        case 'Bíceps':
        case 'Tríceps':
        case 'Trapézio':
        case 'Antebraço':
            return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=150&auto=format&fit=crop';
        default:
            return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop';
    }
}

// Complete Matrix from user request
const rawMatrix = [
    // Peito
    { name: 'Voador', group: 'Peito', equip: 'Máquinas' },
    { name: 'Supino máquina', group: 'Peito', equip: 'Máquinas' },
    { name: 'Supino inclinado máquina', group: 'Peito', equip: 'Máquinas' },
    { name: 'Supino reto (Barra)', group: 'Peito', equip: 'Barra' },
    { name: 'Supino inclinado (Barra)', group: 'Peito', equip: 'Barra' },
    { name: 'Supino declinado (Barra)', group: 'Peito', equip: 'Barra' },
    { name: 'Supino reto (Halteres)', group: 'Peito', equip: 'Halteres' },
    { name: 'Supino inclinado (Halteres)', group: 'Peito', equip: 'Halteres' },
    { name: 'Crucifixo reto', group: 'Peito', equip: 'Halteres' },
    { name: 'Crucifixo inclinado', group: 'Peito', equip: 'Halteres' },
    { name: 'Pullover', group: 'Peito', equip: 'Halteres' },
    { name: 'Crossover alto', group: 'Peito', equip: 'Cabos' },
    { name: 'Crossover médio', group: 'Peito', equip: 'Cabos' },
    { name: 'Crossover baixo', group: 'Peito', equip: 'Cabos' },
    { name: 'Flexão de braço', group: 'Peito', equip: 'Peso corporal' },

    // Costas
    { name: 'Puxada frente aberta', group: 'Costas', equip: 'Máquinas' },
    { name: 'Puxada frente fechada', group: 'Costas', equip: 'Máquinas' },
    { name: 'Remada baixa', group: 'Costas', equip: 'Máquinas' },
    { name: 'Remada articulada', group: 'Costas', equip: 'Máquinas' },
    { name: 'Pulldown máquina', group: 'Costas', equip: 'Máquinas' },
    { name: 'Remada curvada', group: 'Costas', equip: 'Barra' },
    { name: 'Levantamento terra', group: 'Costas', equip: 'Barra' },
    { name: 'Remada unilateral', group: 'Costas', equip: 'Halteres' },
    { name: 'Pullover no cabo', group: 'Costas', equip: 'Cabos' },
    { name: 'Remada baixa triangulo', group: 'Costas', equip: 'Cabos' },
    { name: 'Barra fixa', group: 'Costas', equip: 'Peso corporal' },

    // Ombros
    { name: 'Desenvolvimento máquina', group: 'Ombros', equip: 'Máquinas' },
    { name: 'Elevação lateral máquina', group: 'Ombros', equip: 'Máquinas' },
    { name: 'Crucifixo inverso máquina', group: 'Ombros', equip: 'Máquinas' },
    { name: 'Desenvolvimento', group: 'Ombros', equip: 'Halteres' },
    { name: 'Elevação lateral', group: 'Ombros', equip: 'Halteres' },
    { name: 'Elevação frontal', group: 'Ombros', equip: 'Halteres' },
    { name: 'Crucifixo inverso', group: 'Ombros', equip: 'Halteres' },
    { name: 'Arnold Press', group: 'Ombros', equip: 'Halteres' },
    { name: 'Desenvolvimento militar', group: 'Ombros', equip: 'Barra' },
    { name: 'Elevação lateral (Cabos)', group: 'Ombros', equip: 'Cabos' },
    { name: 'Face Pull', group: 'Ombros', equip: 'Cabos' },

    // Bíceps
    { name: 'Rosca direta', group: 'Bíceps', equip: 'Barra' },
    { name: 'Rosca W (EZ)', group: 'Bíceps', equip: 'Barra' },
    { name: 'Rosca alternada', group: 'Bíceps', equip: 'Halteres' },
    { name: 'Rosca martelo', group: 'Bíceps', equip: 'Halteres' },
    { name: 'Rosca concentrada', group: 'Bíceps', equip: 'Halteres' },
    { name: 'Rosca inclinada', group: 'Bíceps', equip: 'Halteres' },
    { name: 'Rosca Scott máquina', group: 'Bíceps', equip: 'Máquinas' },
    { name: 'Rosca na polia baixa', group: 'Bíceps', equip: 'Cabos' },
    { name: 'Rosca corda', group: 'Bíceps', equip: 'Cabos' },

    // Tríceps
    { name: 'Tríceps corda', group: 'Tríceps', equip: 'Cabos' },
    { name: 'Tríceps barra reta', group: 'Tríceps', equip: 'Cabos' },
    { name: 'Tríceps barra V', group: 'Tríceps', equip: 'Cabos' },
    { name: 'Tríceps francês', group: 'Tríceps', equip: 'Halteres' },
    { name: 'Coice', group: 'Tríceps', equip: 'Halteres' },
    { name: 'Tríceps testa', group: 'Tríceps', equip: 'Barra' },
    { name: 'Supino fechado', group: 'Tríceps', equip: 'Barra' },
    { name: 'Mergulho assistido', group: 'Tríceps', equip: 'Máquinas' },
    { name: 'Paralelas', group: 'Tríceps', equip: 'Peso corporal' },
    { name: 'Banco (Bench Dip)', group: 'Tríceps', equip: 'Peso corporal' },

    // Quadríceps
    { name: 'Leg Press 45°', group: 'Quadríceps', equip: 'Máquinas' },
    { name: 'Leg Press horizontal', group: 'Quadríceps', equip: 'Máquinas' },
    { name: 'Cadeira extensora', group: 'Quadríceps', equip: 'Máquinas' },
    { name: 'Hack Machine', group: 'Quadríceps', equip: 'Máquinas' },
    { name: 'Smith', group: 'Quadríceps', equip: 'Máquinas' },
    { name: 'Agachamento livre', group: 'Quadríceps', equip: 'Barra' },
    { name: 'Agachamento frontal', group: 'Quadríceps', equip: 'Barra' },
    { name: 'Goblet Squat', group: 'Quadríceps', equip: 'Halteres' },
    { name: 'Afundo', group: 'Quadríceps', equip: 'Halteres' },
    { name: 'Passada', group: 'Quadríceps', equip: 'Halteres' },
    { name: 'Bulgarian Split Squat', group: 'Quadríceps', equip: 'Halteres' },

    // Posterior de coxa
    { name: 'Mesa flexora', group: 'Posterior de coxa', equip: 'Máquinas' },
    { name: 'Flexora sentada', group: 'Posterior de coxa', equip: 'Máquinas' },
    { name: 'Stiff', group: 'Posterior de coxa', equip: 'Barra' },
    { name: 'Levantamento terra romeno', group: 'Posterior de coxa', equip: 'Barra' },
    { name: 'Stiff com halteres', group: 'Posterior de coxa', equip: 'Halteres' },

    // Glúteos
    { name: 'Glúteo máquina', group: 'Glúteos', equip: 'Máquinas' },
    { name: 'Abdutora', group: 'Glúteos', equip: 'Máquinas' },
    { name: 'Hip Thrust', group: 'Glúteos', equip: 'Barra' },
    { name: 'Coice no cabo', group: 'Glúteos', equip: 'Cabos' },
    { name: 'Agachamento sumô', group: 'Glúteos', equip: 'Halteres' },

    // Panturrilhas
    { name: 'Panturrilha em pé', group: 'Panturrilhas', equip: 'Máquinas' },
    { name: 'Panturrilha sentado', group: 'Panturrilhas', equip: 'Máquinas' },
    { name: 'Panturrilha no Leg Press', group: 'Panturrilhas', equip: 'Máquinas' },
    { name: 'Panturrilha Smith', group: 'Panturrilhas', equip: 'Máquinas' },

    // Abdômen
    { name: 'Abdominal máquina', group: 'Abdômen', equip: 'Máquinas' },
    { name: 'Crunch', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Elevação de pernas', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Elevação de joelhos', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Prancha', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Prancha lateral', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Abdominal oblíquo', group: 'Abdômen', equip: 'Peso corporal' },
    { name: 'Abdominal no cabo', group: 'Abdômen', equip: 'Cabos' },
    { name: 'Ab Wheel', group: 'Abdômen', equip: 'Peso corporal' },

    // Lombar
    { name: 'Banco romano', group: 'Lombar', equip: 'Máquinas' },
    { name: 'Hiperextensão', group: 'Lombar', equip: 'Peso corporal' },
    { name: 'Superman', group: 'Lombar', equip: 'Peso corporal' },

    // Trapézio
    { name: 'Encolhimento com halteres', group: 'Trapézio', equip: 'Halteres' },
    { name: 'Encolhimento barra', group: 'Trapézio', equip: 'Barra' },
    { name: 'Remada alta', group: 'Trapézio', equip: 'Barra' },
    { name: 'Face Pull', group: 'Trapézio', equip: 'Cabos' },

    // Antebraço
    { name: 'Rosca inversa', group: 'Antebraço', equip: 'Barra' },
    { name: 'Rosca de punho', group: 'Antebraço', equip: 'Barra' },
    { name: 'Rosca de punho reversa', group: 'Antebraço', equip: 'Barra' },
    { name: 'Farmer Walk', group: 'Antebraço', equip: 'Halteres' }
];

// Generate final list of mockExercises dynamically to preserve original 8 detailed ones
const generatedExercises = rawMatrix.map((item, index) => {
    // Check if detailed exercises already contain this exercise
    const existing = detailedExercises.find(e => e.name.toLowerCase() === item.name.toLowerCase());
    if (existing) return null;

    return {
        id: `mat-ex-${index + 1}`,
        name: item.name,
        muscle_group: item.group,
        equipment: item.equip,
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-in-the-gym-42299-large.mp4',
        thumbnail_url: getPlaceholderThumb(item.group),
        description: `Exercício de ${item.name} focado em trabalhar o grupo muscular ${item.group}.`,
        execution_steps: [
            'Posicione-se confortavelmente na área ou aparelho adequado.',
            'Mantenha a postura estabilizada e execute o movimento com foco e controle.',
            'Retorne à posição de repouso controlando o peso.'
        ],
        common_mistakes: [
            'Sacrificar a amplitude de movimento por excesso de carga.',
            'Perder o alinhamento da coluna lombar ou cervical.'
        ],
        difficulty: 'beginner'
    };
}).filter(Boolean);

export const mockExercises = [...detailedExercises, ...generatedExercises];

export const mockWorkouts = [
    {
        id: 'w-1',
        name: 'Superiores — Peito',
        letter: 'A',
        exercises: [
            { id: 'we-1', exercise: mockExercises[0], sets: 3, reps: '12', rest_seconds: 60, weight_kg: 30, order_index: 0, notes: 'Foco na cadência de descida' },
            { id: 'we-2', exercise: mockExercises[4], sets: 3, reps: '12', rest_seconds: 45, weight_kg: 10, order_index: 1, notes: 'Cotovelos levemente flexionados' }
        ]
    },
    {
        id: 'w-2',
        name: 'Costas',
        letter: 'B',
        exercises: [
            { id: 'we-7', exercise: mockExercises[5], sets: 3, reps: '12', rest_seconds: 60, weight_kg: 40, order_index: 0, notes: 'Cotovelos para baixo' }
        ]
    },
    {
        id: 'w-3',
        name: 'Inferiores — Perna',
        letter: 'C',
        exercises: [
            { id: 'we-4', exercise: mockExercises[2], sets: 4, reps: '10', rest_seconds: 90, weight_kg: 50, order_index: 0, notes: 'Descer até 90 graus' },
            { id: 'we-5', exercise: mockExercises[3], sets: 3, reps: '12', rest_seconds: 60, weight_kg: 120, order_index: 1, notes: 'Empurrar com o calcanhar' },
            { id: 'we-6', exercise: mockExercises[7], sets: 3, reps: '12', rest_seconds: 60, weight_kg: 20, order_index: 2, notes: 'Quadril colado na mesa' }
        ]
    },
    {
        id: 'w-4',
        name: 'Braço — Bíceps',
        letter: 'D',
        exercises: [
            { id: 'we-8', exercise: mockExercises[1], sets: 3, reps: '10', rest_seconds: 60, weight_kg: 15, order_index: 0, notes: 'Manter a postura ereta' },
            { id: 'we-3', exercise: mockExercises[6], sets: 4, reps: '10', rest_seconds: 60, weight_kg: 25, order_index: 1, notes: 'Abrir a corda no final' }
        ]
    }
];

export const mockProfile = {
    id: 'user-joao-uuid',
    full_name: 'João Silva',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    phone: '(11) 98765-4321',
    role: 'student',
    student_details: {
        age: 24,
        weight: 76.5,
        height: 1.78,
        goal: 'hypertrophy',
        experience: 'beginner',
        trainer_name: 'Prof. Lucas Ribeiro',
        gender: 'male'
    }
};

export const mockHistory = [
    {
        id: 'h-1',
        workout_id: 'w-1',
        name: 'Superiores — Peito',
        letter: 'A',
        started_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 2).toISOString(),
        completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 1.5).toISOString(),
        duration_seconds: 1800,
        exercises_completed: 2,
        exercises_total: 2
    },
    {
        id: 'h-2',
        workout_id: 'w-2',
        name: 'Costas',
        letter: 'B',
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 3).toISOString(),
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 2.2).toISOString(),
        duration_seconds: 2400,
        exercises_completed: 1,
        exercises_total: 1
    }
];
