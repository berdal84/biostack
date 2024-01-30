#!/bin/bash

# Simple CLI to manage BioStack's dockers
#---------------------------------------

function help() {

  echo "=--------------------------==--------------------------="
  echo "usage: biostack.sh <command> [--prod]"
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

  # prod or dev ?
  case $2 in      
      "--prod") prod=1;;
      "--dev")  prod=0;;
  esac

  if [[ prod -eq 1 ]]
  then
    docker_files="-f base.yml -f prod.yml"
    protocol="https"
  else
    docker_files="-f base.yml -f dev.yml"
    protocol="http"
  fi

  docker compose $docker_files $docker_command ||
    ( echo "[ERROR] Something went wrong with docker compose!" && exit 1)


  # POST command
  case $1 in
    "start")
      echo "BioStack is now running in background. Run '$0 stop' to stop."
      echo "API documentation: ${protocol}://localhost:8000/docs"
      echo "                   ${protocol}://localhost:8000/redoc"
      echo "Frontend:          ${protocol}://localhost <----------- Start Here"

      if [[ prod -eq 0 ]]
      then
        echo "[DEV MODE ON]"
      fi

      ;;
    "install")
      echo "BioStack docker images are now built."
      
      if [[ prod -eq 1 ]]
      then
        echo ""
        echo "You have now to setup the ssl certificates in order to have a secured webserver."
        echo "Be sure this server has port 80 available, and run 'sudo certbot certonly'"
        echo "During the execution or cerbot, the program will ask you for a domain, enter biostack.42borgata.com if you own this domain."
        echo "Otherwize, enter a domain you own that is redirecting to this server. But be sure to update ./reverse-proxy/conf/prod.conf"
        echo "by updating replacing the domain biostack.42borgata.com by yours."
        echo ""
        echo "Once done, BioStack is ready to start."
      fi
      echo "Run '$0 start' to start the dockers in detached mode."
  esac
fi

