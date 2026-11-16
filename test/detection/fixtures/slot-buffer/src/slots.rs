pub struct Slots<T> {
    items: Vec<T>,
}

impl<T> Slots<T> {
    pub fn new() -> Self {
        Self { items: Vec::new() }
    }

    pub fn push(&mut self, item: T) -> usize {
        self.items.push(item);
        self.items.len() - 1
    }

    pub fn try_get(&self, index: usize) -> Option<&T> {
        self.items.get(index)
    }

    pub fn get(&self, index: usize) -> &T {
        unsafe { self.items.get_unchecked(index) }
    }
}

impl<T> Default for Slots<T> {
    fn default() -> Self {
        Self::new()
    }
}
