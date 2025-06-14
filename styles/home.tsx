import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c5ce7', // Modern purple gradient
    paddingTop: 40,
  },
  completedContainer: {
    backgroundColor: '#00b894', // Change to green when completed
  },
  expandingCircle: {
    position: 'absolute',
    backgroundColor: '#00b894', // Modern green
    zIndex: -1, // Behind all content
    opacity: 0.3, // Make it semi-transparent
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    zIndex: 1, // Above background
  },
  completedHeader: {
    // Keep the same styling, the background change is handled by expanding circle
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 5,
    fontWeight: '500',
  },
  // Tab Navigation Styles - Redesigned for 3 tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 3,
    marginTop: 15,
    marginHorizontal: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    zIndex: 2,
    minHeight: 36,
  },
  activeTab: {
    // The indicator will handle the visual active state
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: 7,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Content Container Styles
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tabContent: {
    flexDirection: 'row',
    width: "300%",
    flex: 1,
  },
  tabPanel: {
    width: screenWidth,
    flex: 1,
  },
  // Task Card Styles
  fixedCardStack: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 320, // Slightly increased height
    marginBottom: 30,
    zIndex: 1, // Above background
  },
  swipeableCard: {
    position: 'absolute',
    width: screenWidth - 40,
    backgroundColor: '#ffffff',
    borderRadius: 24, // More rounded
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.1)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  swipeIndicator: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  swipeText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffb3b3',
  },
  deleteText: {
    fontSize: 16,
  },
  taskSection: {
    marginBottom: 16,
  },
  taskLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6c5ce7',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  taskText: {
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Tips Tab Styles
  tipsScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingTop: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  tipDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    fontWeight: '400',
  },
  // History Tab Styles
  historyScrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyHistoryState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyHistoryIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyHistoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHistorySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  historyGroup: {
    marginBottom: 30,
  },
  historyGroupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    paddingLeft: 4,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedBadge: {
    backgroundColor: '#00b894',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  completedTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyLabel: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  historyText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    lineHeight: 21,
    fontWeight: '400',
  },
  // Add Button Styles
  addButton: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 1, // Above background
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.1)',
  },
  completedAddButton: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 184, 148, 0.2)',
  },
  addButtonText: {
    color: '#6c5ce7',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  completedAddButtonText: {
    color: '#00b894',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6c5ce7',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#2d3436',
    borderWidth: 2,
    borderColor: '#e9ecef',
    textAlignVertical: 'top',
    minHeight: 80,
    fontWeight: '400',
  },
  smallInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#2d3436',
    borderWidth: 2,
    borderColor: '#e9ecef',
    fontWeight: '400',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default styles;