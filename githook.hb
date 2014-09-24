# Дополнительные свойства для текта:
BOLD='\033[1m'       #  ${BOLD}      # жирный шрифт (интенсивный цвет)
DBOLD='\033[2m'      #  ${DBOLD}    # полу яркий цвет (тёмно-серый, независимо от цвета)
NBOLD='\033[22m'      #  ${NBOLD}    # установить нормальную интенсивность
UNDERLINE='\033[4m'     #  ${UNDERLINE}  # подчеркивание
NUNDERLINE='\033[4m'     #  ${NUNDERLINE}  # отменить подчеркивание
BLINK='\033[5m'       #  ${BLINK}    # мигающий
NBLINK='\033[5m'       #  ${NBLINK}    # отменить мигание
INVERSE='\033[7m'     #  ${INVERSE}    # реверсия (знаки приобретают цвет фона, а фон -- цвет знаков)
NINVERSE='\033[7m'     #  ${NINVERSE}    # отменить реверсию
BREAK='\033[m'       #  ${BREAK}    # все атрибуты по умолчанию
NORMAL='\033[0m'      #  ${NORMAL}    # все атрибуты по умолчанию

# Цвет текста: 
BLACK='\033[0;30m'     #  ${BLACK}    # чёрный цвет знаков
RED='\033[0;31m'       #  ${RED}      # красный цвет знаков
GREEN='\033[0;32m'     #  ${GREEN}    # зелёный цвет знаков
YELLOW='\033[0;33m'     #  ${YELLOW}    # желтый цвет знаков
BLUE='\033[0;34m'       #  ${BLUE}      # синий цвет знаков
MAGENTA='\033[0;35m'     #  ${MAGENTA}    # фиолетовый цвет знаков
CYAN='\033[0;36m'       #  ${CYAN}      # цвет морской волны знаков
GRAY='\033[0;37m'       #  ${GRAY}      # серый цвет знаков

# Цветом текста (жирным) (bold) :
DEF='\033[0;39m'       #  ${DEF}
DGRAY='\033[1;30m'     #  ${DGRAY}
LRED='\033[1;31m'       #  ${LRED}
LGREEN='\033[1;32m'     #  ${LGREEN}
LYELLOW='\033[1;33m'     #  ${LYELLOW}
LBLUE='\033[1;34m'     #  ${LBLUE}
LMAGENTA='\033[1;35m'   #  ${LMAGENTA}
LCYAN='\033[1;36m'     #  ${LCYAN}
WHITE='\033[1;37m'     #  ${WHITE}

# Цвет фона 
BGBLACK='\033[40m'     #  ${BGBLACK}
BGRED='\033[41m'       #  ${BGRED}
BGGREEN='\033[42m'     #  ${BGGREEN}
BGBROWN='\033[43m'     #  ${BGBROWN}
BGBLUE='\033[44m'     #  ${BGBLUE}
BGMAGENTA='\033[45m'     #  ${BGMAGENTA}
BGCYAN='\033[46m'     #  ${BGCYAN}
BGGRAY='\033[47m'     #  ${BGGRAY}
BGDEF='\033[49m'      #  ${BGDEF}

echo -en "\n ${BGBLACK}${WHITE} Задача {{task}} проверит, все ли хорошо...${NORMAL} "
OUTPUT=$(cd '{{gruntfileDirectory}}' && {{command}}{{#if task}} {{task}}{{/if}}{{#if args}} {{args}}{{/if}})
EXITCODE=$?

if [ $EXITCODE -eq 0 ]; then
	echo -en "${BGGREEN}${WHITE} OK ${NORMAL} \n\n"
else
	echo -en "${BGRED}${WHITE} ABORT ${NORMAL} \n\n"
	echo -en "$OUTPUT"
fi
	
exit $EXITCODE