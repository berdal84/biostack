echo "Cleaning..."
(./backend/clean.sh || ( echo "-- Unable to clean backend!" && exit 1)) &
(./frontend/clean.sh || ( echo "-- Unable to clean frontend!" && exit 1)) &
wait
echo "Cleaned"
