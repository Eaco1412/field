import { StyleSheet, View, Text as RNText } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  Path,
  Filter,
  FeColorMatrix,
  Image,
  Text,
  G,
} from 'react-native-svg';
import { colors, spacing, radius } from '../theme';

interface PuzzleBoardProps {
  completedPieces: number;
  totalPieces: number;
  isUnlocked: boolean;
  theme: 'calmGrowth' | 'homeCreation' | 'gentleLife' | 'humanVision' | 'cityExplore';
  illustration: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string | number;
}

const THEME_COLORS: Record<string, { bg: string; accent: string; light: string; text: string; gradient: string[] }> = {
  calmGrowth: { 
    bg: '#E8F5E9', 
    accent: '#7BAE7F', 
    light: '#F1F8E9', 
    text: '#2E7D32',
    gradient: ['#81C784', '#66BB6A', '#4CAF50', '#388E3C']
  },
  homeCreation: { 
    bg: '#FFF3E0', 
    accent: '#FFB74D', 
    light: '#FFF8E1', 
    text: '#EF6C00',
    gradient: ['#FFB74D', '#FFA726', '#FF9800', '#F57C00']
  },
  gentleLife: { 
    bg: '#FCE4EC', 
    accent: '#F48FB1', 
    light: '#FCEFF4', 
    text: '#C2185B',
    gradient: ['#F48FB1', '#F06292', '#EC407A', '#E91E63']
  },
  humanVision: { 
    bg: '#E3F2FD', 
    accent: '#64B5F6', 
    light: '#E8F5FD', 
    text: '#1976D2',
    gradient: ['#64B5F6', '#42A5F5', '#2196F3', '#1976D2']
  },
  cityExplore: { 
    bg: '#ECEFF1', 
    accent: '#90A4AE', 
    light: '#F5F5F5', 
    text: '#455A64',
    gradient: ['#90A4AE', '#78909C', '#607D8B', '#546E7A']
  },
};

const PUZZLE_TEMPLATES = {
  5: {
    width: 300,
    height: 100,
    pieces: [
      { id: 'p0', path: 'M0 0 L100 0 L100 100 L0 100 Z' },
      { id: 'p1', path: 'M100 0 L200 0 L200 55 C210 55 218 62 218 70 C218 78 210 85 200 85 L200 100 L100 100 Z' },
      { id: 'p2', path: 'M200 0 L300 0 L300 100 L200 100 L200 85 C210 85 218 78 218 70 C218 62 210 55 200 55 Z' },
    ],
  },
  6: {
    width: 300,
    height: 200,
    pieces: [
      { id: 'p0', path: 'M0 0 L100 0 L100 100 L0 100 Z' },
      { id: 'p1', path: 'M100 0 L200 0 L200 60 C210 60 218 68 218 75 C218 82 210 90 200 90 L200 100 L100 100 Z' },
      { id: 'p2', path: 'M200 0 L300 0 L300 100 L200 100 L200 90 C210 90 218 82 218 75 C218 68 210 60 200 60 Z' },
      { id: 'p3', path: 'M0 100 L100 100 L100 200 L0 200 Z' },
      { id: 'p4', path: 'M100 100 L200 100 L200 160 C210 160 218 168 218 175 C218 182 210 190 200 190 L200 200 L100 200 Z' },
      { id: 'p5', path: 'M200 100 L300 100 L300 200 L200 200 L200 190 C210 190 218 182 218 175 C218 168 210 160 200 160 Z' },
    ],
  },
  9: {
    width: 300,
    height: 300,
    pieces: [
      { id: 'p0', path: 'M0 0 L100 0 L100 100 L0 100 Z' },
      { id: 'p1', path: 'M100 0 L200 0 L200 60 C210 60 218 68 218 75 C218 82 210 90 200 90 L200 100 L100 100 Z' },
      { id: 'p2', path: 'M200 0 L300 0 L300 100 L200 100 L200 90 C210 90 218 82 218 75 C218 68 210 60 200 60 Z' },
      { id: 'p3', path: 'M0 100 L100 100 L100 200 L0 200 Z' },
      { id: 'p4', path: 'M100 100 L200 100 L200 160 C210 160 218 168 218 175 C218 182 210 190 200 190 L200 200 L100 200 Z' },
      { id: 'p5', path: 'M200 100 L300 100 L300 200 L200 200 L200 190 C210 190 218 182 218 175 C218 168 210 160 200 160 Z' },
      { id: 'p6', path: 'M0 200 L100 200 L100 300 L0 300 Z' },
      { id: 'p7', path: 'M100 200 L200 200 L200 300 L100 300 Z' },
      { id: 'p8', path: 'M200 200 L300 200 L300 300 L200 300 Z' },
    ],
  },
  12: {
    width: 300,
    height: 400,
    pieces: [
      { id: 'p0', path: 'M0 0 L75 0 L75 100 L0 100 Z' },
      { id: 'p1', path: 'M75 0 L150 0 L150 100 L75 100 Z' },
      { id: 'p2', path: 'M150 0 L225 0 L225 100 L150 100 Z' },
      { id: 'p3', path: 'M225 0 L300 0 L300 100 L225 100 Z' },
      { id: 'p4', path: 'M0 100 L75 100 L75 200 L0 200 Z' },
      { id: 'p5', path: 'M75 100 L150 100 L150 150 C160 150 168 158 168 165 C168 172 160 180 150 180 L150 200 L75 200 Z' },
      { id: 'p6', path: 'M150 100 L225 100 L225 200 L150 200 L150 180 C160 180 168 172 168 165 C168 158 160 150 150 150 Z' },
      { id: 'p7', path: 'M225 100 L300 100 L300 200 L225 200 Z' },
      { id: 'p8', path: 'M0 200 L75 200 L75 300 L0 300 Z' },
      { id: 'p9', path: 'M75 200 L150 200 L150 300 L75 300 Z' },
      { id: 'p10', path: 'M150 200 L225 200 L225 300 L150 300 Z' },
      { id: 'p11', path: 'M225 200 L300 200 L300 300 L225 300 Z' },
    ],
  },
  16: {
    width: 300,
    height: 300,
    pieces: [
      { id: 'p0', path: 'M0 0 L75 0 L75 75 L0 75 Z' },
      { id: 'p1', path: 'M75 0 L150 0 L150 75 L75 75 Z' },
      { id: 'p2', path: 'M150 0 L225 0 L225 75 L150 75 Z' },
      { id: 'p3', path: 'M225 0 L300 0 L300 75 L225 75 Z' },
      { id: 'p4', path: 'M0 75 L75 75 L75 150 L0 150 Z' },
      { id: 'p5', path: 'M75 75 L150 75 L150 150 L75 150 Z' },
      { id: 'p6', path: 'M150 75 L225 75 L225 150 L150 150 Z' },
      { id: 'p7', path: 'M225 75 L300 75 L300 150 L225 150 Z' },
      { id: 'p8', path: 'M0 150 L75 150 L75 225 L0 225 Z' },
      { id: 'p9', path: 'M75 150 L150 150 L150 105 C160 105 168 113 168 120 C168 127 160 135 150 135 L150 225 L75 225 Z' },
      { id: 'p10', path: 'M150 150 L225 150 L225 225 L150 225 L150 135 C160 135 168 127 168 120 C168 113 160 105 150 105 Z' },
      { id: 'p11', path: 'M225 150 L300 150 L300 225 L225 225 Z' },
      { id: 'p12', path: 'M0 225 L75 225 L75 300 L0 300 Z' },
      { id: 'p13', path: 'M75 225 L150 225 L150 300 L75 300 Z' },
      { id: 'p14', path: 'M150 225 L225 225 L225 300 L150 300 Z' },
      { id: 'p15', path: 'M225 225 L300 225 L300 300 L225 300 Z' },
    ],
  },
};

export function PuzzleBoard({
  completedPieces,
  totalPieces,
  isUnlocked,
  theme,
  illustration,
  size = 'md',
  imageUrl,
}: PuzzleBoardProps) {
  const colorset = THEME_COLORS[theme] || THEME_COLORS.calmGrowth;
  
  const templateKey = totalPieces <= 5 ? 5 : totalPieces <= 6 ? 6 : totalPieces <= 9 ? 9 : totalPieces <= 12 ? 12 : 16;
  const template = PUZZLE_TEMPLATES[templateKey];
  
  const scale = size === 'sm' ? 0.5 : size === 'lg' ? 1.2 : 0.8;
  const svgWidth = template.width * scale;
  const svgHeight = template.height * scale;
  
  const pieces = template.pieces.slice(0, totalPieces).map((piece, i) => ({
    ...piece,
    index: i,
    isCompleted: i < completedPieces,
  }));

  return (
    <View style={[styles.container]}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${template.width} ${template.height}`}
      >
        <Defs>
          <Filter id="grayscale" x="-10%" y="-10%" width="120%" height="120%">
            <FeColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
            />
          </Filter>
          
          {pieces.map((piece) => (
            <ClipPath key={`clip-${piece.id}`} id={`clip-${piece.id}`}>
              <Path d={piece.path} />
            </ClipPath>
          ))}
        </Defs>

        {pieces.map((piece) => (
          <G key={piece.id}>
            {imageUrl ? (
              <Image
                href={imageUrl}
                x={0}
                y={0}
                width={template.width}
                height={template.height}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-${piece.id})`}
                filter={piece.isCompleted ? undefined : 'url(#grayscale)'}
                opacity={piece.isCompleted ? 1 : 0.5}
              />
            ) : (
              <Path
                d={piece.path}
                fill={piece.isCompleted ? colorset.gradient[piece.index % colorset.gradient.length] : '#BDBDBD'}
                opacity={piece.isCompleted ? 1 : 0.5}
              />
            )}
            
            <Path
              d={piece.path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            
            <Path
              d={piece.path}
              fill="none"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="1"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            
            {piece.isCompleted && !imageUrl && (
              <Text
                x={template.width / 2}
                y={template.height / 2}
                textAnchor="middle"
                fontSize={template.width * 0.15}
                fill="#fff"
                fontWeight="bold"
              >
                {illustration}
              </Text>
            )}
          </G>
        ))}
      </Svg>

      {isUnlocked && (
        <View style={styles.completedBadge}>
          <RNText style={styles.completedText}>✓ 完成</RNText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    elevation: 4,
  },
  completedText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
});