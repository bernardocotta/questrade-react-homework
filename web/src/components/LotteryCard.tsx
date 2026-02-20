import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import type { Lottery } from '../api/types';

export interface LotteryCardProps {
  lottery: Lottery;
  selected: boolean;
  onSelect: () => void;
}

export function LotteryCard({ lottery, selected, onSelect }: LotteryCardProps) {
  return (
    <Card
      variant="outlined"
      elevation={0}
      onClick={onSelect}
      sx={{
        borderRadius: 2,
        borderWidth: 2,
        borderColor: selected ? 'primary.main' : 'grey.300',
        cursor: 'pointer',
      }}
    >
      <CardContent
        sx={{ position: 'relative', pr: 5, pt: 2, pb: 2 }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <SyncIcon fontSize="small" color="action" />
        </Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {lottery.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {lottery.prize}
        </Typography>
        <Typography
          variant="caption"
          component="code"
          sx={{
            fontFamily: 'monospace',
            display: 'block',
            mt: 0.5,
          }}
        >
          {lottery.id}
        </Typography>
      </CardContent>
    </Card>
  );
}
