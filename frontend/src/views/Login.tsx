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
import { Alert } from "@mui/material";
import { redirect, useNavigate } from "react-router-dom";
import { login, isAuthenticated, } from "../utils/auth";
import authProvider from '../admin/authProvider';

interface Props {
    sx: {
        mt: number;
        mb: number;
    }
};

function Copyright(props: Props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                Incidence report
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
const theme = createTheme();


export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)
        setError('');
        try {
            const data = await login(email, password);

            // if (data['permissions'] === 'user') {
            //     navigate('/dashboard');
            // } else {
            //     navigate('/admin')
            // }
            authProvider.checkAuth().then(
                () => {
                    navigate("/");
                    window.location.reload();
                }
            );
        } catch (err) {
            if (err instanceof Error) {
                // handle errors from the frontend
                setError(err.message)
                setLoading(false);
            } else {
                setError(String(err));
                setLoading(false);
            }


        }
    };

    // return isAuthenticated() ? (
    //     <>
    //         {redirect('/admin')}
    //     </>) : 
    return (
        <>
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
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.currentTarget.value)
                                }
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.currentTarget.value)
                                }
                            />
                            <br />
                            <Grid container alignItems="center">
                                {error && (
                                    <Grid item>
                                        <Alert severity="error">{error}</Alert>
                                    </Grid>
                                )}
                            </Grid>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        {"Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </>
    );
};

{/* <Paper className={theme.padding}>
                <div className={theme.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.currentTarget.value)
                                }
                                fullWidth
                                autoFocus
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={
                                    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Grid>
                        {error && (
                            <Grid item>
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <FormControlLabel
                                control={<Checkbox color="primary" />}
                                label="Remember me"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                disableFocusRipple
                                disableRipple
                                className={theme.button}
                                variant="text"
                                color="primary">
                                Forgot password?
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent='center' className={theme.marginTop}>
                        {' '}
                        <Button
                            variant="outlined"
                            color="primary"
                            className={theme.button}
                            onClick={
                                () => history('/signup')
                            }>
                            Sign Up
                        </Button>{' '}
                        &nbsp;
                        <Button
                            variant="outlined"
                            color="primary"
                            className={theme.button}
                            onClick={handleSubmit}>
                            Login
                        </Button>
                    </Grid>
                </div>
            </Paper> */}