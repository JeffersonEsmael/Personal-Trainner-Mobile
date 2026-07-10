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

export const mockExercises = [
    {
        id: 'ex-1',
        name: 'Supino Reto com Barra',
        muscle_group: 'Peito',
        equipment: 'Barra e Banco',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-in-the-gym-42299-large.mp4', // Free demo video
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
        equipment: 'Barra W ou Reta',
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
        muscle_group: 'Quadríceps / Pernas',
        equipment: 'Barra e Rack',
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
        name: 'Leg Press 45º',
        muscle_group: 'Quadríceps',
        equipment: 'Máquina Leg Press',
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
        name: 'Puxada Frontal',
        muscle_group: 'Costas',
        equipment: 'Polia Alta (Pulley)',
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
        equipment: 'Polia Alta com Corda',
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
        muscle_group: 'Isquiotibiais / Posterior',
        equipment: 'Mesa Flexora Máquina',
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
            'Elevar o quadril da mesa ao flexionar as pernas.',
            'Ajustar o rolo muito alto no tendão ou muito baixo no pé.',
            'Trancos na descida do peso.'
        ],
        difficulty: 'beginner'
    }
];

export const mockWorkouts = [
    {
        id: 'w-1',
        name: 'Superiores — Peito, Tríceps e Ombro',
        letter: 'A',
        exercises: [
            { id: 'we-1', exercise: mockExercises[0], sets: 3, reps: '12', rest_seconds: 60, order_index: 0, notes: 'Foco na cadência de descida' },
            { id: 'we-2', exercise: mockExercises[4], sets: 3, reps: '12', rest_seconds: 45, order_index: 1, notes: 'Cotovelos levemente flexionados' },
            { id: 'we-3', exercise: mockExercises[6], sets: 4, reps: '10', rest_seconds: 60, order_index: 2, notes: 'Abrir a corda no final' }
        ]
    },
    {
        id: 'w-2',
        name: 'Inferiores — Quadríceps e Posterior',
        letter: 'B',
        exercises: [
            { id: 'we-4', exercise: mockExercises[2], sets: 4, reps: '10', rest_seconds: 90, order_index: 0, notes: 'Descer até 90 graus' },
            { id: 'we-5', exercise: mockExercises[3], sets: 3, reps: '12', rest_seconds: 60, order_index: 1, notes: 'Empurrar com o calcanhar' },
            { id: 'we-6', exercise: mockExercises[7], sets: 3, reps: '12', rest_seconds: 60, order_index: 2, notes: 'Quadril colado na mesa' }
        ]
    },
    {
        id: 'w-3',
        name: 'Costas e Bíceps',
        letter: 'C',
        exercises: [
            { id: 'we-7', exercise: mockExercises[5], sets: 3, reps: '12', rest_seconds: 60, order_index: 0, notes: 'Cotovelos para baixo' },
            { id: 'we-8', exercise: mockExercises[1], sets: 3, reps: '10', rest_seconds: 60, order_index: 1, notes: 'Manter a postura ereta' }
        ]
    }
];

export const mockProfile = {
    id: 'user-joao-uuid',
    full_name: 'João Silva',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', // default photo profile
    phone: '(11) 98765-4321',
    role: 'student',
    student_details: {
        age: 24,
        weight: 76.5,
        height: 1.78,
        goal: 'hypertrophy', // Hipertrofia
        experience: 'beginner', // Iniciante
        trainer_name: 'Prof. Lucas Ribeiro',
        gender: 'male'
    }
};

export const mockHistory = [
    {
        id: 'h-1',
        workout_id: 'w-1',
        name: 'Superiores — Peito, Tríceps e Ombro',
        letter: 'A',
        started_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 2).toISOString(), // 4 days ago
        completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 1.5).toISOString(),
        duration_seconds: 1800, // 30 min
        exercises_completed: 3,
        exercises_total: 3
    },
    {
        id: 'h-2',
        workout_id: 'w-2',
        name: 'Inferiores — Quadríceps e Posterior',
        letter: 'B',
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 3).toISOString(), // 2 days ago
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3600 * 1000 * 2.2).toISOString(),
        duration_seconds: 2400, // 40 min
        exercises_completed: 3,
        exercises_total: 3
    }
];
