echo "Cleaning backend..."
cd backend
rm -rf venv || ( echo "Unable to delete venv folder!" && exit 1)
echo "Backend cleaned"
