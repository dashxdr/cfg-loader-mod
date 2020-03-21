#ifndef _MEM_ALLOCATE_H
#define _MEM_ALLOCATE_H

#include <malloc.h>

static  __inline__ void* mem_alloc (size_t size) {
    return malloc(size);
}

static  __inline__ void* mem_realloc (void *p, size_t size) {
    return realloc(p, size);
}

static  __inline__ void* mem_align (size_t a, size_t size) {
    #ifdef __wii__
    return memalign(32, size);
    #else
    return malloc(size);
    #endif
}

static __inline__ void mem_free (void* mem) {
    free(mem);
}

extern void* _EXT2_cache_mem_align (size_t a, size_t size);

extern void _EXT2_cache_mem_free (void* mem);

#endif /* _MEM_ALLOCATE_H */
