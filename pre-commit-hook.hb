NORMAL='\033[0m'
WHITE='\033[1;37m'
BGBLACK='\033[40m'
BGRED='\033[41m'
BGGREEN='\033[42m'

# Hook for master branch only.
BRANCH=`git rev-parse --abbrev-ref HEAD`
if [ $BRANCH != "master" ]; then
    exit 0
fi

echo -en "\n ${BGBLACK}${WHITE} Task '{{command}}{{#if task}} {{task}}{{/if}}{{#if args}} {{args}}{{/if}}' checks everything is okay...${NORMAL} "
OUTPUT=$(cd '{{gruntfileDirectory}}' && {{command}}{{#if task}} {{task}}{{/if}}{{#if args}} {{args}}{{/if}})
EXITCODE=$?

if [ $EXITCODE -eq 0 ]; then
    echo -en "${BGGREEN}${WHITE} OK ${NORMAL} \n\n"
else
    echo -en "${BGRED}${WHITE} {{#if preventExit}}IGNORE{{else}}ABORT{{/if}} ${NORMAL} \n\n"
    echo "$OUTPUT"
fi

{{#unless preventExit}}
exit $EXITCODE
{{/unless}}
