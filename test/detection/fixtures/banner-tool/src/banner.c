#include <stdio.h>
#include <string.h>

#include "banner.h"

void print_banner(const char *title) {
    char line[64];

    strcpy(line, "== ");
    strcat(line, title);
    strcat(line, " ==");

    puts(line);
}
