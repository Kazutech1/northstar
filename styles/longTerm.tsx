import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
export const cardWidth = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
  container: {
    
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 5
  },
  counterText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500'
  },
  scrollableContent: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  row: {
    justifyContent: 'space-between'
  },
  cardSeparator: {
    height: 20
  },
  goalCard: {
    height: 180,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  sectionEmoji: {
    fontSize: 28
  },
  goalCounter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center'
  },
  goalCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16
  },
  cardFooter: {
    marginTop: 10
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2
  },
  progressText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right'
  },
  startText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  cardArrow: {
    position: 'absolute',
    top: 15,
    right: 15,
    opacity: 0.6
  },
  bottomSpacing: {
    height: 20
  }
});

export default styles;
