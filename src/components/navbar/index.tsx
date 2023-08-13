import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import axios from "../../config/interceptor";
import { useRouter } from "next/router";
import { handleError } from "@/utils/response-handler";
import { User } from "@/utils/types";

const pages = [
  {
    url: "/appointments",
    label: "Citas",
    isAdmin: false,
  },
  {
    url: "/",
    label: "Tratamientos",
    isAdmin: true,
  },
  {
    url: "/calendar",
    label: "Calendario",
    isAdmin: true,
  },
];

function NavBar() {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState<null | string>(null);
  const [user, setUser] = React.useState<User>();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("logout", {});
      if (handleError(response.status)) {
        throw new Error(response.data?.message);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(null);
      window.location.replace("/login");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  React.useEffect(() => {
    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user") as string);
    setIsLoggedIn(token);
    setUser(user);
  }, []);

  console.log(user);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CardMedia
            component="img"
            image="/images/logo.png"
            alt="Logo"
            sx={{ display: { xs: "none", md: "flex" }, mr: 1, width: "80px" }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {isLoggedIn ? (
                <div>
                  {pages.map((page) => (
                    <Link
                      href={page.url}
                      sx={{ textDecoration: "none" }}
                      key={page.label}
                    >
                      {!page.isAdmin && (
                        <MenuItem>
                          <Typography textAlign="center">
                            {page.label}
                          </Typography>
                        </MenuItem>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link href="/login" sx={{ textDecoration: "none" }}>
                  <MenuItem>
                    <Typography textAlign="center">Iniciar Sesión</Typography>
                  </MenuItem>
                </Link>
              )}
            </Menu>
          </Box>
          <CardMedia
            component="img"
            image="/images/logo.png"
            alt="Logo"
            sx={{ display: { xs: "flex", md: "none", width: "100px" }, mr: 2 }}
          />
          {isLoggedIn ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "end",
                  mr: "20px",
                }}
              >
                {pages.map((page) => (
                  <React.Fragment key={page.url}>
                    {!page.isAdmin && user?.role_id === 2 && (
                      <Button
                        key={page.label}
                        onClick={() => router.push(page.url)}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page.label}
                      </Button>
                    )}

                    {page.isAdmin && (
                      <Button
                        key={page.label}
                        onClick={() => router.push(page.url)}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page.label}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Abrir Menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/images/pp.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Link href="/profile" sx={{ textDecoration: "none" }}>
                    <MenuItem>
                      <Typography textAlign="center">Perfil</Typography>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={() => handleLogout()}>
                    <Typography textAlign="center" color="primary">
                      Cerrar Sesion
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "end",
              }}
            >
              <Button sx={{ my: 2, color: "white" }} href="/login">
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
