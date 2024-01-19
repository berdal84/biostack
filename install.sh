echo "Installing..."
./backend/install.sh || (echo "Backend install failed" && exit 1)
./frontend/install.sh || (echo "Frontend install failed" && exit 1)
echo "Install done"
echo ""
echo "note: Don't forget to create your .env file in ./backend/ and a database in postgres"
echo "      Read ./backend/README.md for more information."