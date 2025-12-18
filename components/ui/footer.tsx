import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Chip } from "./chip";
import FooterLogo from "./icons/FooterLogo";
import FooterTextSvg from "./icons/FooterTextSvg";

export default function Footer() {
  return (
    <View style={styles.container}>
      <FooterLogo width={200} height={110} />

      <Text style={styles.title}>Wellteens</Text>

      <FooterTextSvg style={styles.footerTextSvg} />

      <Text style={styles.caption}>
        EU Programme Erasmus+ KA2 Cooperation Partnership YOUTH Reference n.
        2023-2-IT03-KA220-YOU-000176636
      </Text>

      <View style={styles.chipWrap}>
        <Chip
          variant="mood"
          label="Fundacja im. Mikołaja Reja"
          style={styles.chip}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: "25%",
  },
  title: {
    textAlign: "center",
    fontSize: 18.6,
    fontStyle: "normal",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  caption: {
    color: "#000",
    textAlign: "center",
    fontSize: 7,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 12,
  },
  chipWrap: {
    marginTop: 12,
  },
  chip: {
    backgroundColor:
      "linear-gradient(93deg, #F2F2F2 23.62%, rgba(241, 238, 229, 0.50) 95.89%);",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  footerTextSvg: {
    marginTop: 6,
    marginBottom: 6,
    width: 220,
    height: 26,
  },
});
