import { Card, CardContent, Typography } from "@mui/material";

const UserProfileCard = ({ user }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>

        <Typography><b>Name:</b> {user.fullName}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Timezone:</b> {user.timezone}</Typography>
        <Typography><b>Currency:</b> {user.currency}</Typography>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
