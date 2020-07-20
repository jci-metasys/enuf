
function _enul() {
  #COMPREPLY='attributeEnumSet'
  COMPREPLY=($(enul complete $COMP_CWORD $COMP_LINE));
}

#alias enul=$HOME/repos/enul/index.js
complete -F _enul enul
