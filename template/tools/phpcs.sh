#!/bin/bash

# Get the list of PHP files changed compared to the base branch
FILES=$(git diff --name-only --diff-filter=d HEAD | grep '\.php$')

if [ -z "$FILES" ]; then
  echo "No PHP files to check."
  exit 0
fi

# Run PHPCS on the changed PHP files
echo "Running PHPCS..."
for FILE in $FILES; do
    # Get line numbers of changes to pass to PHPCS
    LINES=$(git diff HEAD -- "$FILE" | sed -n 's/^\+\+\+ .* \([0-9]*\).*/\1/p' | paste -sd "," -)

    if [ ! -z "$LINES" ]; then
        # Run PHPCS on specific lines
        phpcs --report=full --stdin-path="$FILE" <<< "$(git show :"${FILE}")" -s | sed -n "/${LINES}/p"
    fi
done
