#!/bin/bash

# Simple CLI to manage BioStack's dockers
#---------------------------------------

function help() {

  echo "=--------------------------==--------------------------="
  echo "usage: biostack.sh <command>"
  echo ""
  echo "Available commands:"
  echo "  help*, install, uninstall, restart, start, status, stop. (*:default)"
  echo ""
  echo "Q: Don't know where to start?"
  echo "A: Simply run \"$0 install\" and follow the instructions.";
  echo "=--------------------------==--------------------------="
}

# Expect an argument
if (( $# == 0 ))
then
  help
  echo "[ERROR]: Illegal argument count!"
else  
  # Define common docker compose arguments
  docker_files="-f base.yml -f dev.yml"

  # Map biostack's commands with docker-compose commands
  # PRE command
  case $1 in
    "install")    docker_command="build";;
    "uninstall")  docker_command="down --remove-orphans --volumes --rmi=local";;
    "start")      docker_command="up -d";;
    "restart")    docker_command="restart";;
    "stop")       docker_command="stop";;
    "status")     docker_command="ls";;
    "help")       help;
                  exit 0;;
    *)            help;
                  printf "[ERROR] Command '$1' is unknown.\n"
                  exit 1;
  esac

  docker compose $docker_files $docker_command ${@:2} ||
    ( echo "[ERROR] Something went wrong with docker compose!" && exit 1)

  # POST command
  case $1 in
    "start")
      echo "BioStack is now running in background. Run '$0 stop' to stop."
      echo "API documentation: http://localhost:8000/docs"
      echo "                   http://localhost:8000/redoc"
      echo "Frontend:          https://localhost <----------- Start Here"
      ;;
    "install")
      echo "BioStack docker images are now built."
      echo ""
      echo "You have now to setup the ssl certificates in order to have a secured webserver."
      echo "Be sure this server has port 80 available, and run 'sudo certbot certonly'"
      echo "Follow the instructions, and then copy the generated certificate to ./reverse-proxy/ssl.crt"
      echo "and the key to ./reverse-proxy/ssl.key"
      echo ""
      echo "Once done, BioStack is ready to start. Run '$0 start' to run the dockers (detached mode)."
  esac
fi

