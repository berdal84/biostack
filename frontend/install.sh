echo "Installing Frontend..."
cd frontend
npm install || ( echo "Unable to install!" && exit 1)
echo "Frontend installed"
