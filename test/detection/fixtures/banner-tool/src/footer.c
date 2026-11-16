#include <stdio.h>

#include "banner.h"

void print_footer(const char *note) {
    char line[64];

    snprintf(line, sizeof line, "-- %s --", note);
    puts(line);
}
