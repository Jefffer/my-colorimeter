import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

// Minimal modern font fallback; using built-in fonts
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#0c0d10',
    color: '#ffffff',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#F0BF86', // color de acento para el título
  },
  subtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 6,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    color: '#e6eef0',
    lineHeight: 1.4,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  swatch: {
    width: 100,
    height: 48,
    borderRadius: 6,
    overflow: 'hidden',
  },
  swatchMeta: {
    marginTop: 6,
  },
  swatchName: {
    fontSize: 9,
    fontWeight: 700,
    color: '#fff',
  },
  swatchHex: {
    fontSize: 8,
    color: '#cbd5e1',
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  col: {
    flex: 1,
  },
})

export default function InfographicDocument({ report = {} }) {
  const best = report.best_options || []
  const neutral = report.neutral_options || []
  const avoid = report.avoid_options || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{report.season || 'Tu lectura ToneMap'}</Text>
          <Text style={styles.subtitle}>{report.summary || ''}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Subtono</Text>
            <Text style={styles.paragraph}>{report.undertone || ''}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Por qué funciona</Text>
              <Text style={styles.paragraph}>{report.why_this_works || ''}</Text>
            </View>
          </View>

          {/* <View style={styles.col}>
            <Text style={styles.sectionTitle}>Meta</Text>
            <Text style={styles.paragraph}>Infografía de resultados para conservar y compartir.</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extracto</Text>
              <Text style={styles.paragraph}>{report.summary || ''}</Text>
            </View>
          </View> */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mejores opciones</Text>
          <View style={styles.swatchRow}>
            {best.map((c, i) => (
              <View key={`best-${i}`} style={{ marginRight: 8, marginBottom: 10 }}>
                <View style={{ width: 100, height: 48, backgroundColor: c.hex, borderRadius: 6 }} />
                <View style={styles.swatchMeta}>
                  <Text style={styles.swatchName}>{c.name}</Text>
                  <Text style={styles.swatchHex}>{c.hex}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Neutros</Text>
          <View style={styles.swatchRow}>
            {neutral.map((c, i) => (
              <View key={`neutral-${i}`} style={{ marginRight: 8, marginBottom: 10 }}>
                <View style={{ width: 100, height: 48, backgroundColor: c.hex, borderRadius: 6 }} />
                <View style={styles.swatchMeta}>
                  <Text style={styles.swatchName}>{c.name}</Text>
                  <Text style={styles.swatchHex}>{c.hex}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A evitar</Text>
          <View style={styles.swatchRow}>
            {avoid.map((c, i) => (
              <View key={`avoid-${i}`} style={{ marginRight: 8, marginBottom: 10 }}>
                <View style={{ width: 100, height: 48, backgroundColor: c.hex, borderRadius: 6 }} />
                <View style={styles.swatchMeta}>
                  <Text style={styles.swatchName}>{c.name}</Text>
                  <Text style={styles.swatchHex}>{c.hex}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 9, color: '#9CA3AF' }}>
            Generado por 
            <Text style={{ fontSize: 9, color: '#F0BF86' }}>
              &nbsp;ToneMap&nbsp;
            </Text>
            | conserva este PDF para referencia y compartelo con quien quieras.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
