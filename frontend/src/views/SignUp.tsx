
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { redirect, useNavigate } from 'react-router-dom';
import { signUp, isAuthenticated } from '../utils/auth';


const theme = createTheme()

export const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState<string>('');
    const [fname, setFname] = React.useState<string>('');
    const [lname, setLname] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Password confirmation validation
        event.preventDefault();
        if (password !== passwordConfirmation) setError('Passwords do not match');
        else {
            setError('');
            try {
                const data = await signUp(email, password, passwordConfirmation).then(
                    () => {
                        navigate("/dashboard")
                        window.location.reload();
                    }
                );

            } catch (err) {
                if (err instanceof Error) {
                    // handle errors thrown from frontend
                    setError(err.message);
                } else {
                    setError(String(err))
                }
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={fname}
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setFname(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={lname}
                                    autoComplete="family-name"
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setLname(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={email}
                                    autoComplete="email"
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEmail(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={password}
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirm-password"
                                    label="Confirm Password"
                                    value={passwordConfirmation}
                                    type="password"
                                    id="passwordConfirmation"
                                    autoComplete="new-password"
                                    onChange={
                                        (e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.currentTarget.value)
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Login in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}