import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  modalCloseIcon: {
    color: "#333",
  },
  scrollViewContent: {
    top: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },

  priceBox: {
    marginBottom: 16,
  },
  priceText: {
    fontSize: 16,
  },
  priceHighlight: {
    color: "#FF5722",
    fontWeight: "bold",
    fontSize: 18,
  },
  formContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 6,
  },
  label: {
    marginBottom: 4,
    fontSize: 13,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  bookButton: {
    backgroundColor: "#FF5722",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
