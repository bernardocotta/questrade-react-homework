import {
  Box,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CasinoIcon from '@mui/icons-material/Casino';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import React, { useEffect } from 'react';
import { getLotteries } from './api';
import type { Lottery } from './api/types';
import { AddLotteryModal } from './components/AddLotteryModal';
import { LotteryCard } from './components/LotteryCard';
import { RegisterModal } from './components/RegisterModal';

function App() {
  const [newLotteryModalOpen, setNewLotteryModalOpen] = React.useState(false);
  const [openNewLotteryNotification, setOpenNewLotteryNotification] =
    React.useState(false);
  const [lotteries, setLotteries] = React.useState<Lottery[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedLotteryIds, setSelectedLotteryIds] = React.useState<
    Set<string>
  >(new Set());
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [openRegisterNotification, setOpenRegisterNotification] =
    React.useState(false);
  const [registerNotificationMessage, setRegisterNotificationMessage] =
    React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLotteries = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return lotteries;
    return lotteries.filter((l) => l.name.toLowerCase().includes(q));
  }, [lotteries, searchQuery]);

  const loadLotteries = React.useCallback((): Promise<void> => {
    return getLotteries().then(({ data }) => {
      setLotteries(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadLotteries();
  }, [loadLotteries]);

  const handleToggleLottery = React.useCallback((id: string) => {
    setSelectedLotteryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
        >
          Loteries
          <CasinoIcon fontSize="large" />
        </Typography>
      </Box>

      {!loading && lotteries.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, pb: 2 }}>
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: '100%', maxWidth: 400 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        {loading && <CircularProgress />}
        {!loading && lotteries.length === 0 && (
          <Stack alignItems="center" spacing={1}>
            <SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />
            <Typography color="text.secondary">
              There are no lotteries currently
            </Typography>
          </Stack>
        )}
        {!loading && lotteries.length > 0 && (
          <>
            {filteredLotteries.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}
              >
                {filteredLotteries.map((lottery) => (
                  <Grid key={lottery.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <LotteryCard
                      lottery={lottery}
                      selected={selectedLotteryIds.has(lottery.id)}
                      onSelect={() => handleToggleLottery(lottery.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Stack alignItems="center" spacing={1}>
                <Typography color="text.secondary">
                  No search results for &apos;{searchQuery.trim()}&apos;
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Box>

      <AddLotteryModal
        open={newLotteryModalOpen}
        onClose={() => setNewLotteryModalOpen(false)}
        onSuccess={() => {
          setOpenNewLotteryNotification(true);
          setLoading(true);
          loadLotteries();
        }}
      />

      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        selectedLotteryIds={Array.from(selectedLotteryIds)}
        onSuccess={(message) => {
          setRegisterNotificationMessage(message);
          setOpenRegisterNotification(true);
          setSelectedLotteryIds(new Set());
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Fab
          variant="extended"
          color="default"
          disabled={selectedLotteryIds.size === 0}
          onClick={() => setRegisterModalOpen(true)}
        >
          Register
        </Fab>
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setNewLotteryModalOpen(true)}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Lottery
        </Fab>
      </Box>

      <Snackbar
        open={openNewLotteryNotification}
        autoHideDuration={6000}
        onClose={() => setOpenNewLotteryNotification(false)}
        message="New lottery created"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenNewLotteryNotification(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={openRegisterNotification}
        autoHideDuration={6000}
        onClose={() => setOpenRegisterNotification(false)}
        message={registerNotificationMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenRegisterNotification(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default App;
