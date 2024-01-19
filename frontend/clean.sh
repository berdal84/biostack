echo "Cleaning frontend..."
cd frontend
rm -rf node_modules || (echo "Unable to delete node_modules!" && exit 1)
echo "Frontend cleaned"
