import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
} from "@mui/material";
import React from "react";

const summary = [
  { label: "Total Upcoming IPOs", value: 12 },
  { label: "Open Now", value: 4 },
  { label: "IPOs Applied", value: 8 },
  { label: "Allotted", value: 3 },
  { label: "Total Invested", value: "₹1,25,000" },
  { label: "Profit / Loss", value: "+₹22,540" },
];

const upcoming = [
  {
    name: "ABC Technologies Ltd",
    type: "Mainboard",
    band: "95 - 100",
    lot: 150,
    moneyPerLot: "15,000",
    open: "30 Aug 2024",
    close: "03 Sep 2024",
    gmp: 25,
    estListing: 125,
    status: "Upcoming",
  },
  {
    name: "XYZ Pharma Ltd",
    type: "SME",
    band: "80 - 85",
    lot: 1600,
    moneyPerLot: "1,28,000",
    open: "02 Sep 2024",
    close: "05 Sep 2024",
    gmp: 18,
    estListing: 102,
    status: "Opening Soon",
  },
];

const applied = [
  { name: "XYZ Pharma Ltd", appliedOn: "02 Sep 2024", lots: 2, shares: 3200, amount: "2,56,000", status: "Pending Allotment" },
  { name: "ABC Technologies Ltd", appliedOn: "30 Aug 2024", lots: 1, shares: 150, amount: "15,000", status: "Allotted" },
];

export default function IpoPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>

      {/* Summary cards */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary.map((s) => (
          <Grid key={s.label} item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {s.label}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming IPOs */}

      <Grid container spacing={2}>

        <Grid item xs={12} md={8}>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Upcoming IPOs</Typography>
                <Typography variant="body2" color="text.secondary">IPOs with scheduled dates</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
                <TextField size="small" placeholder="Search IPO name..." sx={{ mr: 1 }} />
                <Select size="small" defaultValue="all" sx={{ mr: 1 }}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="main">Mainboard</MenuItem>
                  <MenuItem value="sme">SME</MenuItem>
                </Select>
                <Button variant="contained" size="small">View Calendar</Button>
              </Grid>
            </Grid>

            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>IPO Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Price Band (₹)</TableCell>
                  <TableCell>Lot Size</TableCell>
                  <TableCell>Money per Lot (₹)</TableCell>
                  <TableCell>Open Date</TableCell>
                  <TableCell>Close Date</TableCell>
                  <TableCell>GMP (₹)</TableCell>
                  <TableCell>Est. Listing Price (₹)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcoming.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.band}</TableCell>
                    <TableCell>{row.lot}</TableCell>
                    <TableCell>{row.moneyPerLot}</TableCell>
                    <TableCell>{row.open}</TableCell>
                    <TableCell>{row.close}</TableCell>
                    <TableCell>
                      <Chip label={`${row.gmp}`} color="success" size="small" />
                    </TableCell>
                    <TableCell>{row.estListing}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">{row.status}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* IPOs Applied table */}

          <Paper sx={{ p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">IPOs Applied</Typography>
                <Typography variant="body2" color="text.secondary">Track all IPOs you have applied for</Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" size="small">Add / Edit Application</Button>
              </Grid>
            </Grid>

            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>IPO Name</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Lots Applied</TableCell>
                  <TableCell>Shares</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Allotment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applied.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.appliedOn}</TableCell>
                    <TableCell>{r.lots}</TableCell>
                    <TableCell>{r.shares}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>
                      <Chip label={r.status} color={r.status === "Allotted" ? "success" : r.status === "Not Allotted" ? "error" : "warning"} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

        </Grid>

        <Grid item xs={12} md={4}>
          {/* Right column: quick stats / watchlist placeholder */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">Watchlist</Typography>
              <Typography variant="body2" color="text.secondary">My Watchlist and quick actions go here.</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="body2" color="text.secondary">GMP (Grey Market Premium) is subject to change. Please do your own research before investing.</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </Box>
  );
}
