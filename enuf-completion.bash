
function _enuf() {
  COMPREPLY=($(enuf complete $COMP_CWORD $COMP_LINE));
}

complete -F _enuf enuf
