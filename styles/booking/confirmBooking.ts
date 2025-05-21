import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tourCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tourImage: {
    width: 100,
    height: 100,
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
    fontWeight: "bold",
    marginTop: 4,
    color: "#000",
  },
  notice: {
    color: "#000",
    marginBottom: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
    fontSize: 12,
  },
  section: {
    marginBottom: 18,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 15,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", 
    marginBottom: 12,
  },

  labelValueBlock: {
    flex: 1, 
    paddingRight: 10, 
  },

  label: {
    fontSize: 14,
    marginBottom: 2,
  },

  value: {
    fontSize: 14,
    color: "#696969",
    flexWrap: "wrap",
  },

  link: {
    color: "#000",
    fontSize: 14,
    textDecorationLine: "underline",
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  contactText: {
    marginBottom: 10,
  },
  sectionSub: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 0.5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#F24E1E",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  discountLabel: {
    fontSize: 14,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  plusBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F35C2C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  plusText: {
    color: "#F35C2C",
    fontSize: 14,
    lineHeight: 15,
  },

  discountText: {
    color: "#F35C2C",
    fontSize: 14,
  },

  disabled: {
    color: "#888",
    fontSize: 14,
  },
  Discount: {
    color: "#F24E1E",
    fontSize: 14,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  introText: {
    fontSize: 14,
    color: "#007BFF",
    backgroundColor: "#DDFAFB",
    padding: 6,
    marginBottom: 16,
  },
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    marginBottom: 16,
  },
  vnpayLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  smallText: {
    fontSize: 12,
    color: "#555",
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkMark: {
    color: "green",
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  policyText: {
    flex: 1,
    fontSize: 13,
    color: "green",
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  checkboxText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#000",
  },
  Newlink: {
    textDecorationLine: "underline",
    color: "#000",
    fontSize: 13,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },

  priceInfo: {
    flex: 1,
  },

  priceRow: {
    fontWeight: "500",
    flexDirection: 'column',
  },

  totalAmount: {
    fontSize: 19,
    fontWeight: "bold",
  },

  prepayRow: {
    fontSize: 14,
    marginTop: 4,
  },

  prepayAmount: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F35C2C",
  },

  button: {
    backgroundColor: "#F35C2C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginLeft: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
