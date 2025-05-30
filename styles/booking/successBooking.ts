import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#f44336", // Màu đỏ cho lỗi
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },

  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    marginTop: 50,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0000000",
    marginLeft: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginLeft: 16,
  },
  tourCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tourImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  tourInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tourTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tourDesc: {
    fontSize: 13,
    color: "#555",
  },
  rating: {
    marginTop: 4,
  },
  price: {
    marginTop: 4,
    color: "#000",
  },
  bold: {
    fontWeight: "bold",
  },
  dateGuestContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },

  labelText: {
    fontSize: 14,
    color: "#666",
  },

  valueText: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
  },
  section: {
    marginBottom: 18,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 6,
  },

  detailLabel: {
    fontWeight: "500",
    color: "#000",
    fontSize: 14,
    paddingLeft: 10,
  },

  detailValue: {
    color: "#333",
    fontSize: 14,
    paddingLeft: 30,
  },

  detailPrice: {
    color: "#F35C2C",
    fontSize: 14,
    paddingLeft: 30,
  },

  detailPriceBold: {
    color: "#F35C2C",
    fontSize: 14,
    fontWeight: "bold",
    paddingLeft: 30,
  },

  exploreButton: {
    backgroundColor: "#F24E1E",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 16,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;
