// Datos de prueba para desarrollo - mockea respuesta de Gemini
// Descomenta el botón en App.jsx para usar esta respuesta de prueba

export const mockGeminiResponse = {
  timestamp: '2026-05-14T08:03:23.629Z',
  type: 'response',
  status: 200,
  model: 'gemini-3-flash-preview',
  payload: {
    report: {
      photo_type: 'portrait',
      validity: {
        is_person: true,
        analyzable: true,
        reason: '',
      },
      season: 'Verano Claro',
      undertone: 'Frío/Neutro',
      summary:
        'Tu paleta ideal consiste en colores suaves, luminosos y con una base fría que complementan tu bajo contraste natural.',
      why_this_works:
        'Los tonos pasteles y empolvados realzan la claridad de tu piel y el brillo de tus ojos sin sobrecargar tus facciones delicadas.',
      best_options: [
        {
          name: 'Azul Cielo',
          hex: '#87CEEB',
          reason: 'Resalta intensamente el color claro de tus ojos.',
        },
        {
          name: 'Rosa Lavanda',
          hex: '#E6E6FA',
          reason: 'Aporta una frescura natural y suaviza las facciones.',
        },
        {
          name: 'Verde Menta',
          hex: '#98FF98',
          reason: 'Armoniza con los matices claros de tu iris.',
        },
        {
          name: 'Gris Perla',
          hex: '#E1E1E1',
          reason: 'Un tono elegante que no compite con tu piel clara.',
        },
        {
          name: 'Sandía Suave',
          hex: '#FF8282',
          reason: 'Aporta calidez sin perder la delicadeza de tu paleta.',
        },
        {
          name: 'Violeta Claro',
          hex: '#B19CD9',
          reason: 'Complementa perfectamente el subtono frío de tu tez.',
        },
      ],
      neutral_options: [
        {
          name: 'Blanco Roto',
          hex: '#F5F5F5',
          reason: 'Más suave que el blanco puro, ideal para tu contraste.',
        },
        {
          name: 'Gris Azulado',
          hex: '#778899',
          reason: 'Un neutro sofisticado que da profundidad sin endurecer.',
        },
        {
          name: 'Beige Arena',
          hex: '#F5F5DC',
          reason: 'Mantiene la luminosidad general de tu rostro.',
        },
        {
          name: 'Azul Acero',
          hex: '#4682B4',
          reason: 'Funciona como un negro más suave y favorecedor.',
        },
      ],
      avoid_options: [
        {
          name: 'Negro Puro',
          hex: '#000000',
          reason: 'Crea sombras pesadas y apaga tu brillo natural.',
        },
        {
          name: 'Naranja Intenso',
          hex: '#FF4500',
          reason: 'Choca con tu subtono frío y puede amarillear la piel.',
        },
        {
          name: 'Marrón Chocolate',
          hex: '#3D2B1F',
          reason: 'Demasiado oscuro y terroso para tu nivel de contraste.',
        },
      ],
    },
  },
}
