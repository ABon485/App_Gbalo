import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  modalTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  modalCloseIcon: {
    color: "#000",
    padding: 7,
    alignSelf: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // mờ nền
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  modalBullet: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 10,
    color: "#444",
  },
  modalFooter: {
    fontSize: 15,
    marginTop: 15,
    color: "#666",
    fontFamily: "Inter-bold",
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    gap: 8,
  },
  scheduleIcon: {
    marginTop: 3,
    color: "#888",
  },
  scheduleTime: {
    fontWeight: "bold",
    minWidth: 60,
    color: "#333",
  },
  scheduleText: {
    flex: 1,
    color: "#444",
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 10,
    color: "#666",
  },
});
export default styles;
