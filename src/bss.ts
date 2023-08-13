import { log } from 'util/logger'

import 'core/bss'
import 'core/containers'
import 'core/module/settings'
import 'core/module/global-state/migrations/runner'

import 'module/theme'
import 'module/infinite-load'
import 'module/preview'
import 'module/filters'
import 'module/memo'
import 'module/search'

log('Modules loaded')
