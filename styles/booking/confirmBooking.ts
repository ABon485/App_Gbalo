import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
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
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  labelValuePair: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
  },
  link: {
    color: "#00000",
    fontSize: 14,
    textDecorationLine: "underline",
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
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
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
  disabled: {
    color: "#888",
    fontSize: 14,
  },
  Discount: {
    color: "#F24E1E",
    fontSize: 14,
  },
  paymentTitle: {
    fontSize: 16,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  priceHighlight: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    backgroundColor: "#F24E1E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
