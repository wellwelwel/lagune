#include <stdio.h>

#include "banner.h"

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "usage: banner <title> <note>\n");
        return 1;
    }

    print_banner(argv[1]);
    print_footer(argv[2]);

    return 0;
}
