import React from 'react';
import { Document, Page, View, Text, StyleSheet, Svg, Path, Link, Image, Font } from '@react-pdf/renderer';
import sora400 from '@fontsource/sora/files/sora-latin-400-normal.woff';
import sora600 from '@fontsource/sora/files/sora-latin-600-normal.woff';

// --- REGISTRAR FUENTES ---
Font.register({
  family: 'Sora',
  src: sora400,
  fontWeight: 400,
});
Font.register({
  family: 'Sora',
  src: sora600,
  fontWeight: 600,
});

// --- CONFIGURACIÓN DE TEMA ---
const THEME = {
  bg: '#0c0d10',
  surface: '#161922',
  surfaceBorder: '#232736', // Nuevo color para bordes sutiles
  text: '#f5efe7',
  muted: '#b9b2a9',
  accent: '#f0bf86',
  dangerSoft: '#ffd7d7',
};

// --- ICONOS VECTORIALES ---
const Icons = {
  Star: () => (
    <Svg width="14" height="14" viewBox="0 0 24 24">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={THEME.accent} />
    </Svg>
  ),
  Sparkle: () => (
    <Svg width="14" height="14" viewBox="0 0 24 24">
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={THEME.accent} />
    </Svg>
  ),
  Neutral: () => (
    <Svg width="14" height="14" viewBox="0 0 24 24">
      <Path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" fill={THEME.text} />
    </Svg>
  ),
  Avoid: () => (
    <Svg width="14" height="14" viewBox="0 0 24 24">
      <Path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill={THEME.dangerSoft} />
    </Svg>
  ),
  Github: () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill={THEME.muted} />
    </Svg>
  ),
  Linkedin: () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill={THEME.muted} />
    </Svg>
  )
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontFamily: 'Sora',
    backgroundColor: THEME.bg,
    color: THEME.text,
  },
  
  // --- HEADER EDITORIAL ---
  headerLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alineación central para equilibrar la foto grande
    marginBottom: 20,
    borderBottom: `1px solid ${THEME.surfaceBorder}`,
    paddingBottom: 20,
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 25,
  },
  badge: {
    backgroundColor: THEME.surface,
    border: `1px solid ${THEME.surfaceBorder}`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: THEME.accent,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 10,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 10.5,
    color: THEME.muted,
    lineHeight: 1.5,
  },
  
  photoContainer: {
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden', // Importante para que el objectFit respete el border radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo condicional solo cuando NO hay imagen
  photoPlaceholderEmpty: {
    backgroundColor: THEME.surface,
    border: `1.5px dashed rgba(255,255,255,0.15)`,
  },
  photoText: {
    fontSize: 9,
    color: THEME.muted,
    textAlign: 'center',
    padding: 10,
  },
  userImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Asegura que la imagen rellene el contenedor sin deformarse
  },

  // --- CALLOUT BOX ---
  analysisBox: {
    backgroundColor: THEME.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 28,
    borderLeft: `3px solid ${THEME.accent}`,
  },
  analysisTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.accent,
    marginBottom: 6,
  },
  analysisText: {
    fontSize: 9.5,
    color: THEME.text,
    lineHeight: 1.6,
  },

  styleSection: {
    marginBottom: 18,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleCard: {
    width: '48.5%',
    backgroundColor: THEME.surface,
    border: `1px solid ${THEME.surfaceBorder}`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  styleCardAccent: {
    height: 2,
    width: '100%',
    backgroundColor: THEME.accent,
    borderRadius: 999,
    marginBottom: 10,
  },
  styleCardLabel: {
    fontSize: 8,
    color: THEME.accent,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  styleCardValue: {
    fontSize: 10.5,
    color: THEME.text,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 1.3,
  },
  styleCardText: {
    fontSize: 8,
    color: THEME.muted,
    lineHeight: 1.45,
  },
  makeupList: {
    marginTop: 4,
  },
  makeupLine: {
    fontSize: 8,
    color: THEME.muted,
    lineHeight: 1.45,
    marginTop: 2,
  },

  // --- GRIDS ---
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: THEME.text,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  // --- TARJETAS INFORMATIVAS ---
  card: {
    backgroundColor: THEME.surface,
    border: `1px solid ${THEME.surfaceBorder}`, // Borde sutil para darle profundidad
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  // Variaciones de ancho dinámicas
  card3Col: { width: '31.5%' },
  card4Col: { width: '23.5%' }, // 4 columnas para los neutros
  
  colorBlock: {
    height: 38,
    width: '100%',
  },
  cardContent: {
    padding: 10,
  },
  // Alturas fijas para asegurar alineación visual perfecta
  cardContent3Col: { height: 52 },
  cardContent4Col: { height: 52 }, // Más alto en 4 cols para compensar el ancho estrecho
  
  colorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: THEME.text,
    flex: 1,
  },
  colorHex: {
    fontSize: 6.5,
    color: THEME.muted,
    fontFamily: 'Courier',
  },
  colorReason: {
    fontSize: 6.5,
    color: THEME.muted,
    lineHeight: 1.4,
  },

  // --- FOOTER ---
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTop: `1px solid ${THEME.surfaceBorder}`,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialGroup: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    textDecoration: 'none',
  },
  footerText: {
    fontSize: 8,
    color: THEME.muted,
  },
  footerBrand: {
    color: THEME.accent,
    fontWeight: 'bold',
  }
});

// Componente para la Tarjeta de Color con Razón
const SwatchCard = ({ color, isFourCol = false }) => (
  <View style={[styles.card, isFourCol ? styles.card4Col : styles.card3Col]} wrap={false}>
    <View style={[styles.colorBlock, { backgroundColor: color.hex }]} />
    <View style={[styles.cardContent, isFourCol ? styles.cardContent4Col : styles.cardContent3Col]}>
      <View style={styles.colorHeader}>
        <Text style={styles.colorName} numberOfLines={1}>{color.name}</Text>
        <Text style={styles.colorHex}>{color.hex.toUpperCase()}</Text>
      </View>
      <Text style={styles.colorReason}>{color.reason}</Text>
    </View>
  </View>
);

export default function InfographicDocument({ report = {}, previewUrl = null }) {
  const { best_options = [], neutral_options = [], avoid_options = [] } = report;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABECERA */}
        <View style={styles.headerLayout}>
          <View style={styles.titleWrapper}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Subtono: {report.undertone || 'Desconocido'}</Text>
            </View>
            <Text style={styles.title}>{report.season || 'Tu Análisis ToneMap'}</Text>
            <Text style={styles.subtitle}>{report.summary || 'Resumen completo de tu colorimetría.'}</Text>
          </View>
          
          {/* FOTOGRAFÍA: Dinámica según si existe URL o no */}
          <View style={[styles.photoContainer, !previewUrl && styles.photoPlaceholderEmpty]}>
            {previewUrl ? (
              <Image src={previewUrl} style={styles.userImage} />
            ) : (
              <Text style={styles.photoText}>[ Foto del Usuario ]</Text>
            )}
          </View>
        </View>

        {/* CALLOUT BOX */}
        {report.why_this_works && (
          <View style={styles.analysisBox}>
            <Text style={styles.analysisTitle}>¿Por qué esta es tu paleta?</Text>
            <Text style={styles.analysisText}>{report.why_this_works}</Text>
          </View>
        )}

        {/* SECCIÓN: DETALLES DE ESTILO */}
        {(report.contrast_level || report.best_metals || report.makeup_tips || report.hair_color_advice) && (
          <View style={styles.styleSection} wrap={false}>
            <View style={styles.sectionHeader}>
              <Icons.Sparkle />
              <Text style={styles.sectionTitle}>Detalles de estilo</Text>
            </View>

            <View style={styles.styleGrid}>
              {report.contrast_level && (
                <View style={styles.styleCard}>
                  <View style={styles.styleCardAccent} />
                  <Text style={styles.styleCardLabel}>Contraste</Text>
                  <Text style={styles.styleCardValue}>{report.contrast_level}</Text>
                  <Text style={styles.styleCardText}>Usa este nivel como referencia para construir looks más armónicos.</Text>
                </View>
              )}

              {report.best_metals && (
                <View style={styles.styleCard}>
                  <View style={styles.styleCardAccent} />
                  <Text style={styles.styleCardLabel}>Metales</Text>
                  <Text style={styles.styleCardValue}>{report.best_metals.primary}</Text>
                  <Text style={styles.styleCardText}>{report.best_metals.reason}</Text>
                </View>
              )}

              {report.makeup_tips && (
                <View style={styles.styleCard}>
                  <View style={styles.styleCardAccent} />
                  <Text style={styles.styleCardLabel}>Maquillaje ideal</Text>
                  <Text style={styles.styleCardValue}>Lo que funciona para ti</Text>
                  <Text style={styles.styleCardText}><Text style={styles.footerBrand}>Labios: </Text> {report.makeup_tips.lipstick}</Text>
                  <Text style={styles.styleCardText}><Text style={styles.footerBrand}>Rubor: </Text> {report.makeup_tips.blush}</Text>
                  {/* <View style={styles.makeupList}>
                    <Text style={styles.makeupLine}>Piensa en acabados suaves y colores que mantengan la naturalidad del rostro.</Text>
                  </View> */}
                </View>
              )}

              {report.hair_color_advice && (
                <View style={styles.styleCard}>
                  <View style={styles.styleCardAccent} />
                  <Text style={styles.styleCardLabel}>Cabello</Text>
                  <Text style={styles.styleCardValue}>Sugerencia de color</Text>
                  <Text style={styles.styleCardText}>{report.hair_color_advice}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* SECCIÓN: ESTRELLAS (3 Columnas) */}
        {best_options.length > 0 && (
          <View style={styles.section} wrap={true}>
            <View style={styles.sectionHeader}>
              <Icons.Star />
              <Text style={styles.sectionTitle}>Tus Colores Estrella</Text>
            </View>
            <View style={styles.grid}>
              {best_options.map((c, i) => <SwatchCard key={`best-${i}`} color={c} />)}
            </View>
          </View>
        )}

        {/* SECCIÓN: NEUTROS (1 Fila de 4 Columnas) */}
        {neutral_options.length > 0 && (
          <View style={styles.section} wrap={true}>
            <View style={styles.sectionHeader}>
              <Icons.Neutral />
              <Text style={styles.sectionTitle}>Neutros Elegantes</Text>
            </View>
            <View style={styles.grid}>
              {/* Forzamos que solo tome los primeros 4 para garantizar 1 sola fila plana */}
              {neutral_options.slice(0, 4).map((c, i) => (
                <SwatchCard key={`neutral-${i}`} color={c} isFourCol={true} />
              ))}
            </View>
          </View>
        )}

        {/* SECCIÓN: A EVITAR (3 Columnas) */}
        {avoid_options.length > 0 && (
          <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeader}>
              <Icons.Avoid />
              <Text style={[styles.sectionTitle, { color: THEME.dangerSoft }]}>Tonos a Evitar</Text>
            </View>
            <View style={styles.grid}>
              {avoid_options.map((c, i) => <SwatchCard key={`avoid-${i}`} color={c} />)}
            </View>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generado por <Text style={styles.footerBrand}>ToneMap</Text>
          </Text>
          
          <View style={styles.socialGroup}>
            <Link src="https://github.com/Jefffer" style={styles.socialLink}>
              <Icons.Github />
              <Text style={styles.footerText}>/Jefffer</Text>
            </Link>
            <Link src="https://www.linkedin.com/in/jefffer/" style={styles.socialLink}>
              <Icons.Linkedin />
              <Text style={styles.footerText}>/jefffer</Text>
            </Link>
          </View>
        </View>

      </Page>
    </Document>
  );
}