import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
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
    fontWeight: "bold",
    marginTop: 4,
    color: "#000",
  },
  dateGuestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
  },
  guestTextContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
  },
  guestText: {
    fontSize: 14,
    color: "#555",
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
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#000000",
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
  },
  detailValuePrice: {
    fontSize: 14,
    color: "#F24E1E",
    fontWeight: "bold",
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