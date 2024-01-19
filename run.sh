echo "Running..."
(./backend/run.sh || (echo "Backend couldn't start" && exit 1)) &
(./frontend/run.sh || (echo "Frontend couldn't start" && exit 1)) &
wait
echo "Stopped"