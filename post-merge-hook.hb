# MIT © Sindre Sorhus - sindresorhus.com
# git hook to run a command after `git pull` if a specified file was changed

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
    echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

# `npm install` if the `package.json` file gets changed
check_run package.json "npm install"

# `grunt bower:install` if the `bower.json` file gets changed
check_run bower.json "grunt bower:install"

# `grunt githooks` to bind git hooks if `post-merge-hook.hb` or `pre-commit-hook.hb` files gets changed
check_run hook.hb "grunt githooks"
