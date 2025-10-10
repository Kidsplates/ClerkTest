cd ~
ls -a   # ← .zshrc や .bashrc があるか確認

# ~/.zshrc の末尾に追加
autoload -U add-zsh-hook
load-nvmrc() {
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    nvm use --silent || nvm install
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
