$scriptblock = {
    param($wordToComplete, $commandAst, $cursorPosition)
    $wordPosition = $commandAst.CommandElements.Count - 1
    $ast = $commandAst.ToString() -split ' '
    enuf complete $wordPosition @ast
}
Register-ArgumentCompleter -Native -CommandName enuf -ScriptBlock $scriptblock
