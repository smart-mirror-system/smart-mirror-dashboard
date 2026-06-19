#!/bin/sh

# =======================================================================================================================
# AUTHOR      : Mohamed Fouad Rashed                                                                                     
# DATE        : 19 June 2026                                                                                             
# LINKEDIN    : https://www.linkedin.com/in/mohamed-fouad71/                                                             
# GITHUB      : https://github.com/MohamedFouad71                                                                        
# -----------------------------------------------------------------------------------------------------------------------
# DESCRIPTION : this script searches for every .js and .html files in the repo for any string 'http://localhost:3000'        
#               and replace it with the enviromental variable BACKEND_URL, this will be used in docker nginx container   
#               and in github pages action to set the backend url to refine docker deployment and github pages action.   
# =======================================================================================================================

#------------ Variables for logging ------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'


#------------ Script Body ------------

set -e

echo -e "This script was written by ${GREEN}Mohamed Fouad${NC} to replace all 'localhost:3000' with the enviromental variable BACKEND_URL"
echo -e "If you face any problem please feel free to contact me"
echo -e "${BLUE}Starting script...${NC}"
echo "------------------------------------------------------------------------------------------------------------------------"

echo -e "Checking if BACKEND_URL is set..."

if [ -z "${BACKEND_URL}" ]; then
    echo -e "${RED}BACKEND_URL is not set, please set it before running this script${NC}"
    exit 1
fi

echo -e "${GREEN}BACKEND_URL exists!!!${NC}"

echo "------------------------------------------------------------------------------------------------------------------------"
echo -e "Checking for 'http://localhost:3000' in js and html files..."
echo "------------------------------------------------------------------------------------------------------------------------"

find . -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|http://localhost:3000|${BACKEND_URL}|g" {} +

echo -e "${GREEN}Replacement completed successfully!!!${NC}"
echo -e "${GREEN}End of Script${NC}"

echo "------------------------------------------------------------------------------------------------------------------------"

# Hand over execution to the main container command
exec "$@"
