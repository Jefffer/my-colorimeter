import React from 'react';
import { Document, Page, View, Text, StyleSheet, Svg, Path, Link, Image } from '@react-pdf/renderer';

// --- CONFIGURACIÓN DE TEMA ---
const THEME = {
  bg: '#0c0d10',
  surface: '#161922',
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
    paddingBottom: 60, // Espacio para el footer
    fontFamily: 'Helvetica',
    backgroundColor: THEME.bg,
    color: THEME.text,
  },
  
  // --- HEADER EDITORIAL ---
  headerLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottom: `1px solid ${THEME.surface}`,
    paddingBottom: 20,
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 20,
  },
  badge: {
    backgroundColor: THEME.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    color: THEME.accent,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 8,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 10,
    color: THEME.muted,
    lineHeight: 1.4,
  },
  
  // --- PLACEHOLDER FOTO USUARIO ---
  photoPlaceholder: {
    width: 80,
    height: 106,
    backgroundColor: THEME.surface,
    borderRadius: 6,
    border: `1px dashed rgba(255,255,255,0.15)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 8,
    color: THEME.muted,
    textAlign: 'center',
    padding: 10,
  },

  // --- CALLOUT BOX (Por qué funciona) ---
  analysisBox: {
    backgroundColor: THEME.surface,
    borderRadius: 8,
    padding: 16,
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
    fontSize: 9,
    color: THEME.text,
    lineHeight: 1.5,
  },

  // --- GRID DE 3 COLUMNAS ---
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  // --- TARJETAS INFORMATIVAS ---
  card: {
    width: '31.5%',
    backgroundColor: THEME.surface,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  colorBlock: {
    height: 35,
    width: '100%',
  },
  cardContent: {
    padding: 8,
    height: 60, // Altura fija para alinear el texto de las razones
  },
  colorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: THEME.text,
    flex: 1,
  },
  colorHex: {
    fontSize: 6,
    color: THEME.muted,
    fontFamily: 'Courier',
  },
  colorReason: {
    fontSize: 6.5,
    color: THEME.muted,
    lineHeight: 1.3,
  },

  // --- FOOTER REDES SOCIALES ---
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTop: `1px solid ${THEME.surface}`,
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
const SwatchCard = ({ color }) => (
  <View style={styles.card}>
    <View style={[styles.colorBlock, { backgroundColor: color.hex }]} />
    <View style={styles.cardContent}>
      <View style={styles.colorHeader}>
        <Text style={styles.colorName} numberOfLines={1}>{color.name}</Text>
        <Text style={styles.colorHex}>{color.hex.toUpperCase()}</Text>
      </View>
      {/* Mostramos la razón analítica */}
      <Text style={styles.colorReason}>{color.reason}</Text>
    </View>
  </View>
);

export default function InfographicDocument({ report = {}, previewUrl = null }) {
  const { best_options = [], neutral_options = [], avoid_options = [] } = report;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABECERA (Héroe + Badge + Placeholder Foto) */}
        <View style={styles.headerLayout}>
          <View style={styles.titleWrapper}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Subtono: {report.undertone || 'Desconocido'}</Text>
            </View>
            <Text style={styles.title}>{report.season || 'Tu Análisis ToneMap'}</Text>
            <Text style={styles.subtitle}>{report.summary || 'Resumen de tu colorimetría.'}</Text>
          </View>
          
          <View style={styles.photoPlaceholder}>
            {previewUrl ? (
              <Image src={previewUrl} style={{ width: 80, height: 106, borderRadius: 6 }} />
            ) : (
              <Text style={styles.photoText}>[ Foto del Usuario ]</Text>
            )}
          </View>
        </View>

        {/* CALLOUT BOX: ¿Por qué funciona? */}
        {report.why_this_works && (
          <View style={styles.analysisBox}>
            <Text style={styles.analysisTitle}>¿Por qué esta es tu paleta?</Text>
            <Text style={styles.analysisText}>{report.why_this_works}</Text>
          </View>
        )}

        {/* SECCIÓN: ESTRELLAS */}
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

        {/* SECCIÓN: NEUTROS */}
        {neutral_options.length > 0 && (
          <View style={styles.section} wrap={true}>
            <View style={styles.sectionHeader}>
              <Icons.Neutral />
              <Text style={styles.sectionTitle}>Neutros Elegantes</Text>
            </View>
            <View style={styles.grid}>
              {neutral_options.map((c, i) => <SwatchCard key={`neutral-${i}`} color={c} />)}
            </View>
          </View>
        )}

        {/* SECCIÓN: A EVITAR */}
        {avoid_options.length > 0 && (
          <View style={styles.section} wrap={true}>
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
            Generado por <Text style={styles.footerBrand}>ToneMap AI</Text>
          </Text>
          
          <View style={styles.socialGroup}>
            <Link src="https://github.com/Jefffer" style={styles.socialLink}>
              <Icons.Github />
              <Text style={styles.footerText}>/Jefffer</Text>
            </Link>
            <Link src="https://www.linkedin.com/in/jefffer/" style={styles.socialLink}>
              <Icons.Linkedin />
              <Text style={styles.footerText}>LinkedIn</Text>
            </Link>
          </View>
        </View>

      </Page>
    </Document>
  );
}