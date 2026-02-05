<template>
  <div class="config-list-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:format-list-bulleted" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('config.title') }}</h1>
        <Badge
          variant="secondary"
          class="rounded-full px-4 py-1 text-sm font-semibold transition-colors flex items-center gap-1"
          :class="currentTenant ? 'cursor-pointer hover:bg-muted-foreground/20' : ''"
          @click="handleCopyNamespace"
          :title="currentTenant ? $t('config.message.copySuccess') : ''"
        >
          {{ currentTenantShowName }}
          <Icon v-if="currentTenant" icon="mdi:content-copy" class="ml-1 text-[10px] opacity-30 hover:opacity-100 transition-opacity" />
        </Badge>
      </div>
    </div>

    <!-- 命名空间快速切换 -->
    <div class="namespace-container animate-in fade-in slide-in-from-top-5 duration-600">
      <div v-if="namespacesLoading" class="namespace-tabs">
        <div v-for="i in 5" :key="i" class="namespace-tab-item skeleton-tab"></div>
      </div>
      <div v-else class="namespace-tabs">
        <div
          v-for="ns in namespaces"
          :key="ns.namespace"
          class="namespace-tab-item"
          :class="{ active: currentTenant === ns.namespace }"
          @click="handleTenantChange(ns.namespace)"
        >
          {{ ns.namespaceShowName }}
        </div>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid">
            <div class="search-field">
              <Label class="field-label">{{ $t('config.search.dataId') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-magnify" class="control-icon" />
                <Input v-model="queryParams.dataId" :placeholder="$t('config.search.dataIdPlaceholder')" class="compact-input" />
              </div>
            </div>
            <div class="search-field">
              <Label class="field-label">{{ $t('config.search.group') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-folder-outline" class="control-icon" />
                <Input v-model="queryParams.group" :placeholder="$t('config.search.groupPlaceholder')" class="compact-input" />
              </div>
            </div>
            <div class="search-field">
              <Label class="field-label">{{ $t('config.search.appName') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-apps" class="control-icon" />
                <Input v-model="queryParams.appName" :placeholder="$t('config.search.appNamePlaceholder')" class="compact-input" />
              </div>
            </div>
            <div class="search-field">
              <Label class="field-label">{{ $t('config.search.tags') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-tag-outline" class="control-icon" />
                <Input v-model="queryParams.config_tags" :placeholder="$t('config.search.tagsPlaceholder')" class="compact-input" />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              {{ $t('config.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('config.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作栏 -->
    <div class="action-bar animate-in fade-in slide-in-from-top-8 duration-900">
      <div class="action-left">
        <Button @click="handleCreate" class="operation-btn shadow-lg shadow-primary/20 hover-lift">
          <Icon type="uno" icon="i-mdi-plus-circle" class="mr-2 text-lg" />
          {{ $t('config.action.create') }}
        </Button>

        <!-- 导出功能 -->
        <DropdownMenu v-slot="{ isOpen, toggle, close }">
          <Button
            class="operation-btn shadow-lg shadow-primary/20 hover-lift"
            @click="toggle"
          >
            <Icon type="uno" icon="i-mdi-export-variant" class="mr-2" />
            {{ $t('config.action.export') }}
            <Icon type="uno" icon="i-mdi-chevron-down" class="ml-1 opacity-50 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
          </Button>
          <DropdownMenuContent align="start" class="w-48 export-dropdown-content" :is-open="isOpen">
            <DropdownMenuItem class="export-item" @click="handleExport(false); close()">
              <Icon type="uno" icon="i-mdi-file-export-outline" class="mr-2" />
              {{ $t('config.action.exportQuery') }}
            </DropdownMenuItem>
            <DropdownMenuItem class="export-item" @click="handleExport(true); close()">
              <Icon type="uno" icon="i-mdi-file-export" class="mr-2" />
              {{ $t('config.action.exportQueryNew') }}
            </DropdownMenuItem>
            <div class="my-1 border-t border-muted opacity-50" />
            <DropdownMenuItem
              :disabled="selectedRows.length === 0"
              class="export-item"
              @click="handleExportSelected(false); close()"
            >
              <Icon type="uno" icon="i-mdi-selection-multiple" class="mr-2" />
              {{ $t('config.action.exportSelected') }}
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="selectedRows.length === 0"
              class="export-item"
              @click="handleExportSelected(true); close()"
            >
              <Icon type="uno" icon="i-mdi-selection-marker" class="mr-2" />
              {{ $t('config.action.exportSelectedNew') }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- 导入配置 -->
        <Button
          class="operation-btn shadow-lg shadow-primary/20 hover-lift"
          @click="handleImport"
        >
          <Icon type="uno" icon="i-mdi-import" class="mr-2" />
          {{ $t('config.action.import') }}
        </Button>

        <div v-if="selectedRows.length > 0" class="batch-actions animate-in slide-in-from-left-4">
          <div class="flex items-center gap-3">
            <Button @click="handleBatchClone" class="operation-btn shadow-lg shadow-primary/20 hover-lift bg-primary text-white">
              <Icon type="uno" icon="i-mdi-content-copy" class="mr-1" />
              {{ $t('config.action.batchClone') }}
            </Button>
            <Button variant="destructive" @click="handleBatchDelete" class="operation-btn btn-destructive shadow-lg shadow-destructive/20 hover-lift">
              <Icon type="uno" icon="i-mdi-delete-outline" class="mr-1" />
              {{ $t('config.action.batchDelete') }} ({{ selectedRows.length }})
            </Button>
          </div>
        </div>
      </div>
      <div class="action-right">
        <div class="stats-badge">
          <Icon type="uno" icon="i-mdi-information-outline" class="mr-2" />
          {{ $t('config.table.totalConfigs', { total: totalCount }) }}
        </div>
      </div>
    </div>

    <!-- 配置列表表格 -->
    <Card class="table-card border-none shadow-sm">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <TableHead class="checkbox-col">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :checked="isAllSelected"
                  @change="handleSelectAll"
                />
              </TableHead>
              <TableHead @click="handleSort('dataId')" class="sortable">
                Data ID
                <Icon
                  type="uno"
                  v-if="sortField === 'dataId'"
                  :icon="sortOrder === 'asc' ? 'i-mdi-arrow-up' : 'i-mdi-arrow-down'"
                  class="ml-1 text-primary"
                />
              </TableHead>
              <TableHead @click="handleSort('group')" class="sortable">
                Group
                <Icon
                  type="uno"
                  v-if="sortField === 'group'"
                  :icon="sortOrder === 'asc' ? 'i-mdi-arrow-up' : 'i-mdi-arrow-down'"
                  class="ml-1 text-primary"
                />
              </TableHead>
              <TableHead @click="handleSort('appName')" class="sortable">
                {{ $t('config.table.appName') }}
                <Icon
                  type="uno"
                  v-if="sortField === 'appName'"
                  :icon="sortOrder === 'asc' ? 'i-mdi-arrow-up' : 'i-mdi-arrow-down'"
                  class="ml-1 text-primary"
                />
              </TableHead>
              <TableHead class="text-left">{{ $t('config.table.operations') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="configList.length > 0">
              <TableRow
                v-for="config in configList"
                :key="`${config.dataId}-${config.group}`"
                :class="{ 'selected-row': isSelected(config) }"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell class="checkbox-col">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="isSelected(config)"
                    @change="handleSelectRow(config)"
                  />
                </TableCell>
                <TableCell>
                  <div class="data-id-cell">

                    <span class="font-mono text-sm">{{ config.dataId }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="group-tag">{{ config.group }}</Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center text-muted-foreground">

                    {{ config.appName || '-' }}
                  </div>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row transition-opacity duration-200">
                    <Button variant="ghost" size="sm" class="action-btn text-primary" @click="handleView(config)">
                      {{ $t('config.action.view') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button variant="ghost" size="sm" class="action-btn text-info" @click="handleEdit(config)">
                      {{ $t('config.action.edit') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button variant="ghost" size="sm" class="action-btn text-destructive" @click="handleDelete(config)">
                      {{ $t('config.action.delete') }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="5" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <Icon type="uno" icon="i-mdi-database-off-outline" class="text-5xl mb-2 opacity-20" />
                  <p>{{ $t('config.table.empty') }}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- 分页 -->
        <div v-if="totalCount > 0" class="pagination-container">
          <div class="pagination-info">
            {{ $t('config.pagination.itemInfo', {
               start: ((queryParams.pageNo || 1) - 1) * (queryParams.pageSize || 10) + 1,
               end: Math.min((queryParams.pageNo || 1) * (queryParams.pageSize || 10), totalCount),
               total: totalCount
            }) }}
          </div>
          <div class="pagination-controls">
            <div class="page-size-picker">
              <span class="text-xs text-muted-foreground">{{ $t('config.pagination.pageSize') }}</span>
              <PageSizeSelector v-model="queryParams.pageSize" @update:model-value="handlePageSizeChange" />
            </div>
            <div class="page-navigation">
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="(queryParams.pageNo || 1) === 1"
                @click="handlePageChange((queryParams.pageNo || 1) - 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-left" />
              </Button>
              <div class="page-numbers">
                <span class="current-page">{{ queryParams.pageNo || 1 }}</span>
                <span class="page-divider">/</span>
                <span class="total-pages">{{ Math.ceil(totalCount / (queryParams.pageSize || 10)) }}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="(queryParams.pageNo || 1) >= Math.ceil(totalCount / (queryParams.pageSize || 10))"
                @click="handlePageChange((queryParams.pageNo || 1) + 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 创建配置 Dialog -->
    <Dialog v-model="dialogOpen">
      <DialogContent class="config-create-dialog max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <!-- 头部 -->
        <DialogHeader class="px-6 py-4 border-b bg-muted/5">
          <DialogTitle class="text-lg font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-md bg-primary/10 text-primary">
              <Icon type="uno" icon="i-mdi-file-document-edit-outline" />
            </div>
            {{ dialogMode === 'create' ? $t('config.dialog.createTitle') : (dialogMode === 'detail' ? $t('config.dialog.detailTitle') : $t('config.dialog.editTitle', { dataId: formData.dataId })) }}
          </DialogTitle>
          <DialogDescription class="text-xs text-muted-foreground flex flex-col gap-1">
            <div>{{ dialogMode === 'create' ? $t('config.dialog.createDesc') : (dialogMode === 'detail' ? $t('config.dialog.detailDesc') : $t('config.dialog.editDesc')) }}</div>
            <div class="flex items-center gap-1.5 opacity-80">
              <span class="text-muted-foreground">{{ $t('config.dialog.currentNamespace') }}</span>
              <span class="text-primary font-bold">{{ currentTenantShowName }}</span>
              <span class="text-muted-foreground">|</span>
              <span class="font-mono">{{ currentTenant || 'public' }}</span>
            </div>
          </DialogDescription>
          <Button variant="ghost" size="icon" class="absolute right-4 top-4 rounded-full hover:bg-muted" @click="handleDialogClose">
            <Icon type="uno" icon="i-mdi-close" class="text-lg" />
          </Button>
        </DialogHeader>

        <!-- 内容体：左右布局 -->
        <div class="flex-1 min-h-0 flex overflow-hidden">
          <!-- 左侧：元数据表单 -->
          <div class="w-[380px] border-r overflow-y-auto bg-muted/5 p-6 space-y-6">
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-1 h-4 bg-primary rounded-full"></span>
                <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">{{ $t('config.dialog.basicInfo') }}</h3>
              </div>

              <div class="grid grid-cols-1 gap-5">
                <!-- Data ID -->
                <div class="space-y-1.5 rounded-lg transition-all">
                  <Label for="dataId" class="text-xs font-bold flex items-center gap-1">
                    Data ID <span class="text-destructive">*</span>
                  </Label>
                  <div class="relative">
                    <Icon type="uno" icon="i-mdi-identifier" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs" />
                    <Input
                      id="dataId"
                      v-model="formData.dataId"
                      :placeholder="$t('config.search.dataIdPlaceholder')"
                      class="pl-9 h-10 bg-background border-muted/50 focus:border-primary transition-all text-sm focus-visible:ring-0"
                      autocomplete="off"
                      :class="errors.dataId ? 'border-destructive' : ''"
                      :readonly="['detail', 'edit'].includes(dialogMode)"
                    />
                  </div>
                  <p v-if="errors.dataId" class="text-[10px] text-destructive font-medium animate-in fade-in slide-in-from-top-1">{{ errors.dataId }}</p>
                </div>

                <!-- Group -->
                <div class="space-y-1.5">
                  <Label for="group" class="text-xs font-bold flex items-center gap-1">
                    Group <span class="text-destructive">*</span>
                  </Label>
                  <div class="relative">
                    <Icon type="uno" icon="i-mdi-folder-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs" />
                    <Input
                      id="group"
                      v-model="formData.group"
                      placeholder="DEFAULT_GROUP"
                      class="pl-9 h-10 bg-background border-muted/50 focus:border-primary transition-all text-sm focus-visible:ring-0"
                      autocomplete="off"
                      :class="errors.group ? 'border-destructive' : ''"
                      :readonly="['detail', 'edit'].includes(dialogMode)"
                    />
                  </div>
                  <p v-if="errors.group" class="text-[10px] text-destructive font-medium animate-in fade-in slide-in-from-top-1">{{ errors.group }}</p>
                </div>

                <!-- 归属应用 -->
                <div class="space-y-1.5">
                  <Label for="appName" class="text-xs font-bold text-muted-foreground">{{ $t('config.search.appName') }}</Label>
                  <div class="relative">
                    <Icon type="uno" icon="i-mdi-application-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs" />
                    <Input
                      id="appName"
                      v-model="formData.appName"
                      :placeholder="$t('config.search.appNamePlaceholder')"
                      class="pl-9 h-10 bg-background border-muted/50 focus:border-primary transition-all text-sm focus-visible:ring-0"
                      autocomplete="off"
                      :readonly="dialogMode === 'detail'"
                    />
                  </div>
                </div>

                <!-- 标签 -->
                <div class="space-y-1.5">
                  <Label for="tags" class="text-xs font-bold text-muted-foreground">{{ $t('config.dialog.configTags') }}</Label>
                  <div class="relative">
                    <Icon type="uno" icon="i-mdi-tag-multiple-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs" />
                    <Input
                      id="tags"
                      v-model="formData.tags"
                      :placeholder="$t('config.dialog.configTagsPlaceholder')"
                      class="pl-9 h-10 bg-background border-muted/50 focus:border-primary transition-all text-sm focus-visible:ring-0"
                      autocomplete="off"
                      :readonly="dialogMode === 'detail'"
                    />
                  </div>
                </div>

                <!-- 描述 -->
                <div class="space-y-1.5">
                  <Label for="desc" class="text-xs font-bold text-muted-foreground">{{ $t('config.dialog.configDesc') }}</Label>
                  <Textarea
                    id="desc"
                    v-model="formData.desc"
                    :placeholder="$t('config.dialog.configDescPlaceholder')"
                    class="bg-background border-muted/50 focus:border-primary transition-all text-sm min-h-[100px] resize-none focus-visible:ring-0"
                    autocomplete="off"
                    :readonly="dialogMode === 'detail'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：编辑器 -->
          <div class="flex-1 flex flex-col overflow-hidden bg-background">
            <!-- 工具栏 -->
            <div class="h-14 px-6 border-b flex items-center justify-between bg-muted/5">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ $t('config.dialog.configFormat') }}</span>
                <div class="flex p-0.5 bg-muted rounded-lg border border-muted-foreground/10">
                  <button
                    v-for="type in ['text', 'json', 'xml', 'yaml', 'html', 'properties']"
                    :key="type"
                    class="px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase"
                    :class="formData.configType === type ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/50'"
                    :disabled="dialogMode === 'detail'"
                    @click="dialogMode !== 'detail' && (formData.configType = type)"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon type="uno" icon="i-mdi-code-braces" class="text-primary/60" />
                <span>{{ $t('config.dialog.realTimeHighlight') }}</span>
              </div>
            </div>

            <!-- 代码编辑区域 -->
            <div class="flex-1 relative overflow-hidden group">
              <MonacoEditor
                v-model:value="formData.content"
                :language="editorLanguage"
                theme="vs-dark"
                :options="{
                  readOnly: dialogMode === 'detail',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: 'Fira Code, Consolas, monospace',
                  automaticLayout: true,
                }"
                class="absolute inset-0"
              />
              <div v-if="errors.content" class="absolute bottom-4 right-6 bg-destructive text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 z-10">
                <Icon type="uno" icon="i-mdi-alert-circle-outline" />
                {{ errors.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="p-6 border-t bg-muted/10 flex justify-end items-center gap-3">
          <div v-if="dialogMode !== 'detail'" class="mr-auto text-xs text-muted-foreground flex items-center gap-1">
            <Icon type="uno" icon="i-mdi-shield-check-outline" class="text-green-500" />
            {{ $t('config.dialog.allFieldsValidated') }}
          </div>

          <!-- 详情模式下的比对按钮 -->
          <template v-if="dialogMode === 'detail'">
            <Button
              variant="outline"
              class="min-w-[120px] h-10 font-bold border-2"
              @click="handleConfigCompare"
            >
              <Icon type="uno" icon="i-mdi-compare" class="mr-2" />
              {{ $t('config.dialog.configCompare') }}
            </Button>
            <Button
              variant="outline"
              class="min-w-[120px] h-10 font-bold border-2"
              @click="handleVersionCompare"
            >
              <Icon type="uno" icon="i-mdi-history" class="mr-2" />
              {{ $t('config.dialog.versionCompare') }}
            </Button>
          </template>

          <Button variant="outline" class="min-w-[100px] h-10 font-bold border-2" @click="handleDialogClose">{{ $t('config.dialog.cancel') }}</Button>

          <!-- 只在创建模式下显示提交按钮 -->
          <Button
            v-if="dialogMode !== 'detail'"
            variant="default"
            :disabled="submitting"
            class="min-w-[140px] h-10 font-bold shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90"
            @click="handlePreSubmit"
          >
            <Icon v-if="submitting" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
            {{ dialogMode === 'edit' ? $t('config.dialog.publish') : $t('config.dialog.submit') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Diff Editor Dialog -->
    <DiffEditorDialog
      v-model:open="diffDialogOpen"
      :originalContent="originalContent"
      :modifiedContent="formData.content"
      :language="editorLanguage"
      :title="$t('config.dialog.publish') + ' - ' + formData.dataId"
      :description="`请确认以下配置变更，Group: ${formData.group}`"
      @confirm="handleRealSubmit"
    />

    <!-- 批量克隆 Dialog -->
    <Dialog v-model="cloneDialogOpen">
      <DialogContent class="max-w-[800px] p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader class="px-6 py-4 border-b bg-muted/5">
          <DialogTitle class="text-lg font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-md bg-primary/10 text-primary">
              <Icon type="uno" icon="i-mdi-content-copy" />
            </div>
            {{ $t('config.clone.title') }}
          </DialogTitle>
          <DialogDescription>{{ $t('config.clone.desc') }}</DialogDescription>
        </DialogHeader>

        <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <!-- 概览信息 -->
          <div class="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border border-dashed border-muted-foreground/20">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">{{ $t('config.clone.sourceNamespace') }}</span>
              <span class="font-bold text-primary">{{ currentTenantShowName }}</span>
              <span class="text-xs text-muted-foreground opacity-60">({{ currentTenant || 'public' }})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">{{ $t('config.clone.selectedConfigs') }}</span>
              <span class="font-bold text-primary">{{ cloneConfigs.length }}</span>
              <span class="text-muted-foreground">{{ $t('config.clone.unit') }}</span>
            </div>
          </div>

          <!-- 选择目标 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {{ $t('config.clone.targetNamespace') }} <span class="text-destructive">*</span>
              </Label>
              <Select v-model="cloneTargetTenant" :placeholder="$t('config.clone.targetNamespacePlaceholder')" :class="cloneErrors.targetTenant ? 'border-destructive' : ''" @update:model-value="cloneErrors.targetTenant = ''">
                <option v-for="ns in namespaces" :key="ns.namespace" :value="ns.namespace" :disabled="ns.namespace === currentTenant">
                   {{ ns.namespaceShowName }} {{ ns.namespace ? `(${ns.namespace})` : '' }}
                </option>
              </Select>
              <p v-if="cloneErrors.targetTenant" class="text-[10px] text-destructive font-bold animate-pulse">{{ cloneErrors.targetTenant }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ $t('config.clone.conflictPolicy') }}</Label>
              <Select v-model="clonePolicy">
                <option value="ABORT">{{ $t('config.clone.policyAbort') }}</option>
                <option value="SKIP">{{ $t('config.clone.policySkip') }}</option>
                <option value="OVERWRITE">{{ $t('config.clone.policyOverwrite') }}</option>
              </Select>
            </div>
          </div>

          <!-- 可编辑列表 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                {{ $t('config.clone.itemDetails') }}
                <span class="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full lowercase font-normal italic">
                  {{ $t('config.clone.itemDetailsTip') }}
                </span>
              </Label>
            </div>
            <div class="border rounded-xl overflow-hidden shadow-sm">
              <div class="overflow-y-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow class="bg-muted/50 hover:bg-muted/50">
                      <TableHead class="font-bold text-xs">Data ID</TableHead>
                      <TableHead class="font-bold text-xs">Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(item, index) in cloneConfigs" :key="index" class="hover:bg-muted/5 transition-colors">
                      <TableCell class="p-0 border-r border-muted/20">
                        <Input
                          v-model="item.dataId"
                          class="border-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-none h-10 px-4 text-xs font-medium"
                          :placeholder="$t('config.search.dataIdPlaceholder')"
                        />
                      </TableCell>
                      <TableCell class="p-0">
                        <Input
                          v-model="item.group"
                          class="border-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-none h-10 px-4 text-xs font-medium"
                          :placeholder="$t('config.search.groupPlaceholder')"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-muted/10 flex justify-end items-center gap-3">
          <Button variant="outline" class="min-w-[100px] h-10 font-bold border-2" @click="cloneDialogOpen = false" :disabled="cloning">{{ $t('config.dialog.cancel') }}</Button>
          <Button
            :disabled="cloning"
            class="min-w-[140px] h-10 font-bold shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 transition-all hover:scale-[1.02]"
            @click="confirmClone"
          >
            <Icon v-if="cloning" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
            <Icon v-else type="uno" icon="i-mdi-check-circle-outline" class="mr-2" />
            {{ $t('config.clone.startClone') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 导入配置 Dialog -->
    <Dialog v-model="importDialogOpen">
      <DialogContent class="max-w-[600px] p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader class="px-6 py-4 border-b bg-muted/5">
          <DialogTitle class="text-lg font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-md bg-primary/10 text-primary">
              <Icon type="uno" icon="i-mdi-import" />
            </div>
            {{ $t('config.import.title') }}
          </DialogTitle>
          <DialogDescription>{{ $t('config.import.desc') }}</DialogDescription>
        </DialogHeader>

        <div class="p-6 space-y-6">
          <!-- 目标命名空间 -->
          <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground">{{ $t('config.import.targetNamespace') }}</span>
            <span class="font-bold text-info">{{ currentTenantShowName }}</span>
            <span class="text-muted-foreground">|</span>
            <span class="font-mono text-muted-foreground">{{ currentTenant || 'public' }}</span>
          </div>

          <!-- 冲突处理策略 -->
          <div class="space-y-2">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ $t('config.import.conflictPolicy') }}</Label>
            <Select v-model="importPolicy">
              <option value="ABORT">{{ $t('config.import.policyAbort') }}</option>
              <option value="SKIP">{{ $t('config.import.policySkip') }}</option>
              <option value="OVERWRITE">{{ $t('config.import.policyOverwrite') }}</option>
            </Select>
          </div>

          <!-- 提示信息 -->
          <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg flex items-start gap-3 text-xs text-amber-700 dark:text-amber-400">
            <Icon type="uno" icon="i-mdi-alert-circle-outline" class="text-lg mt-0.5 shrink-0" />
            <p>{{ $t('config.import.note') }}</p>
          </div>

          <!-- 文件上传区域 -->
          <div class="space-y-3">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ $t('config.import.selectFile') }}</Label>
            <div
              class="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-muted/5 cursor-pointer"
              @click="fileInput?.click()"
            >
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept=".zip"
                @change="onFileChange"
              />
              <div v-if="!importFile" class="text-center">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon type="uno" icon="i-mdi-cloud-upload" class="text-2xl" />
                </div>
                <p class="text-sm font-medium">{{ $t('config.import.uploadTip') }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ $t('config.import.supportFormat') }}</p>
              </div>
              <div v-else class="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-lg border w-full">
                <Icon type="uno" icon="i-mdi-file-zip-outline" class="text-primary text-xl" />
                <div class="text-left flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ importFile.name }}</p>
                  <p class="text-[10px] text-muted-foreground">{{ (importFile.size / 1024).toFixed(2) }} KB</p>
                </div>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:bg-destructive/10" @click.stop="importFile = null">
                  <Icon type="uno" icon="i-mdi-close" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-muted/10 flex justify-end items-center gap-3">
          <Button variant="outline" class="min-w-[100px] h-10 font-bold border-2" @click="importDialogOpen = false" :disabled="importing">{{ $t('config.dialog.cancel') }}</Button>
          <Button
            :disabled="importing || !importFile"
            class="min-w-[140px] h-10 font-bold shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90"
            @click="confirmImport"
          >
            <Icon v-if="importing" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
            <Icon v-else type="uno" icon="i-mdi-check-circle-outline" class="mr-2" />
            {{ $t('config.import.startImport') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

definePage({
  meta: {
    locales: ['config'],
  },
})

defineOptions({
  name: 'ConfigList'
})

import { configService } from '@/services/configuration/config-service'
import type { Config, ConfigListReq } from '@/services/configuration/config-service'
import { namespaceService } from '@/services/namespace/namespace-service'
import { validateContent } from '@/utils/validateContent'
import { confirm, alertError, alertSuccess } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'
import { api } from '@/http'
import { useAuthStore } from '@/stores'
const MonacoEditor = defineAsyncComponent(() => import('monaco-editor-vue3'))
import DiffEditorDialog from '@/components/diff/DiffEditorDialog.vue'

// 查询参数
const queryParams = ref<ConfigListReq>({
  dataId: '',
  group: '',
  appName: '',
  config_tags: '',
  pageNo: 1,
  pageSize: 10,
  tenant: '',
  search: 'blur',
  username: 'cnfg',
})

// 当前命名空间
const currentTenant = ref('')

// 命名空间列表
const namespaces = ref<Array<{ namespace: string; namespaceShowName: string }>>([])
const namespacesLoading = ref(true)

// 计算当前命名空间显示名称
const currentTenantShowName = computed(() => {
  const ns = namespaces.value.find(n => n.namespace === currentTenant.value)
  return ns ? ns.namespaceShowName : (currentTenant.value || 'public')
})

const editorLanguage = computed(() => {
  const type = formData.value.configType.toLowerCase()
  if (type === 'text') return 'plaintext'
  if (type === 'properties') return 'ini'
  return type
})

// 配置列表数据
const configList = ref<Config[]>([])
const totalCount = ref(0)
const loading = ref(false)

// 排序
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// 行选择
const selectedRows = ref<Config[]>([])

// 创建配置 Dialog
const dialogOpen = ref(false)
const diffDialogOpen = ref(false)
const submitting = ref(false)
const dialogMode = ref<'create' | 'edit' | 'detail'>('create') // 对话框模式
const originalContent = ref('') // 原始内容，用于 diff

// 表单数据
const formData = ref({
  dataId: '',
  group: 'DEFAULT_GROUP',
  tags: '',
  appName: '',
  desc: '',
  configType: 'text',
  content: '',
  md5: '',
})

// 表单验证错误
const errors = ref<Record<string, string>>({})

// 计算属性
const isAllSelected = computed(() => {
  return configList.value.length > 0 && selectedRows.value.length === configList.value.length
})

// 批量克隆相关状态
const cloneDialogOpen = ref(false)
const cloneTargetTenant = ref<string | undefined>(undefined)
const clonePolicy = ref('ABORT')
const cloneConfigs = ref<any[]>([])
const cloning = ref(false)
const cloneErrors = ref<Record<string, string>>({})

// 导入配置相关状态
const importDialogOpen = ref(false)
const importPolicy = ref('ABORT')
const importFile = ref<File | null>(null)
const importing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// 方法
const loadNamespaces = async () => {
  namespacesLoading.value = true
  try {
    // 传递 namespaceId 参数，确保后端能正确处理
    const response = await namespaceService.getList({ namespaceId: '' })
    if (Array.isArray(response)) {
      namespaces.value = response
      // 处理 public 命名空间，如果 namespace 为空字符串，需要特殊处理 key
      // 不过这里 key 使用 namespace 属性，空字符串也是有效的 key
      if (namespaces.value.length > 0 && currentTenant.value === '' && !queryParams.value.tenant) {
        // 初始加载，如果 currentTenant 为空且 queryParams.tenant 也为空
        // 尝试设置默认值。通常 public 的 namespace 为 ''。
        // 如果列表中第一个就是 public (namespace is empty), 那么 currentTenant 保持 '' 即可。
        // 如果第一个不是 public，赋值为第一个的 namespace。
        // 但是这里为了稳健，我们直接赋值为第一个。
        currentTenant.value = namespaces.value[0]?.namespace ?? ''
      }
    }
  } catch (error) {
    console.error('加载命名空间失败:', error)
    // 默认命名空间
    namespaces.value = [{ namespace: '', namespaceShowName: t('config.common.public') }]
    currentTenant.value = ''
  } finally {
    namespacesLoading.value = false
  }
}

const loadConfigList = async () => {
  loading.value = true
  try {
    queryParams.value.tenant = currentTenant.value
    queryParams.value.search = 'blur' // 默认模糊查询

    // 使用当前登录用户名
    // 从 authStore 获取
    const authStore = useAuthStore()
    const currentUsername = authStore.user?.username || 'nacos'
    queryParams.value.username = currentUsername

    const response = await configService.getList(queryParams.value)
    configList.value = response.pageItems || []
    totalCount.value = response.totalCount || 0

    // 客户端排序
    if (sortField.value) {
      configList.value.sort((a, b) => {
        const aVal = (a as any)?.[sortField.value] || ''
        const bVal = (b as any)?.[sortField.value] || ''
        if (sortOrder.value === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }
  } catch (error) {
    console.error('加载配置列表失败:', error)
    configList.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

const handleTenantChange = (namespace: string) => {
  currentTenant.value = namespace
  queryParams.value.pageNo = 1
  selectedRows.value = []
  loadConfigList()
}

const handleCopyNamespace = async () => {
  if (!currentTenant.value) return
  try {
    await navigator.clipboard.writeText(currentTenant.value)
    toastSuccess(t('config.message.copySuccess'))
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const handleSearch = () => {
  queryParams.value.pageNo = 1
  loadConfigList()
}

const handleReset = () => {
  queryParams.value = {
    dataId: '',
    group: '',
    appName: '',
    config_tags: '',
    pageNo: 1,
    pageSize: queryParams.value.pageSize,
    tenant: currentTenant.value,
    search: 'blur',
  }
  loadConfigList()
}

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  loadConfigList()
}

// 导出功能
const openUri = (url: string, params: any) => {
  const authStoreStr = localStorage.getItem('auth')
  const authState = authStoreStr ? JSON.parse(authStoreStr) : {}
  const token = authState.token || ''
  const username = authState.user?.username || ''

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value))
    }
  })
  query.append('accessToken', token)
  query.append('username', username)

  window.open(`${url}?${query.toString()}`)
}

const handleExport = (v2 = false) => {
  const params: any = {
    tenant: currentTenant.value,
    dataId: queryParams.value.dataId,
    group: queryParams.value.group,
    appName: queryParams.value.appName,
    ids: '',
  }
  if (v2) {
    params.exportV2 = 'true'
  } else {
    params.export = 'true'
  }
  openUri('/v1/cs/configs', params)
  toastSuccess(t('config.message.exportSuccess', { count: totalCount.value }))
}

const handleExportSelected = (v2 = false) => {
  if (selectedRows.value.length === 0) return
  const ids = selectedRows.value.map(row => row.id).join(',')
  const params: any = {
    tenant: currentTenant.value,
    group: '',
    appName: '',
    dataId: '',
    ids,
  }
  if (v2) {
    params.exportV2 = 'true'
  } else {
    params.export = 'true'
  }
  openUri('/v1/cs/configs', params)
  toastSuccess(t('config.message.exportSuccess', { count: selectedRows.value.length }))
}

const handleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  if (checked) {
    selectedRows.value = [...configList.value]
  } else {
    selectedRows.value = []
  }
}

const handleSelectRow = (config: Config) => {
  const index = selectedRows.value.findIndex(
    (item) => item.dataId === config.dataId && item.group === config.group,
  )
  if (index >= 0) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(config)
  }
}

const isSelected = (config: Config) => {
  return selectedRows.value.some(
    (item) => item.dataId === config.dataId && item.group === config.group,
  )
}

const handlePageChange = (page: number) => {
  queryParams.value.pageNo = page
  loadConfigList()
}

const handlePageSizeChange = () => {
  queryParams.value.pageNo = 1
  loadConfigList()
}

// 验证特殊字符
const validateChart = (value: string): boolean => {
  const chartReg = /[@#$%^&*\s]+/g
  return !chartReg.test(value)
}

// 验证表单字段
const validateForm = (): boolean => {
  errors.value = {}

  // Data ID 验证
  if (!formData.value.dataId.trim()) {
    errors.value.dataId = t('config.dialog.dataIdRequired')
  } else if (!validateChart(formData.value.dataId)) {
    errors.value.dataId = t('config.dialog.dataIdInvalid')
  }

  // Group 验证
  if (!formData.value.group.trim()) {
    errors.value.group = t('config.dialog.groupRequired')
  } else if (formData.value.group.length > 127) {
    errors.value.group = t('config.dialog.groupMaxLength')
  } else if (!validateChart(formData.value.group)) {
    errors.value.group = t('config.dialog.groupInvalid')
  }

  // 配置内容验证
  if (!formData.value.content.trim()) {
    errors.value.content = t('config.dialog.contentRequired')
  }

  return Object.keys(errors.value).length === 0
}

// 重置表单
const resetForm = () => {
  formData.value = {
    dataId: '',
    group: 'DEFAULT_GROUP',
    tags: '',
    appName: '',
    desc: '',
    configType: 'text',
    content: '',
    md5: '',
  }
  errors.value = {}
}

// 关闭 Dialog
const handleDialogClose = () => {
  dialogOpen.value = false
  resetForm()
}

// 打开创建配置 Dialog
const handleCreate = () => {
  resetForm()
  dialogMode.value = 'create'
  dialogOpen.value = true
}

const handlePreSubmit = async () => {
    if (dialogMode.value === 'detail') {
        handleDialogClose()
        return
    }
    // 1. 基础字段验证
    if (!validateForm()) {
        return
    }
    // 2. 格式校验
    const formatCheck = validateContent.validate({
        content: formData.value.content,
        type: formData.value.configType,
    })

    if (!formatCheck.valid) {
        console.log('格式校验失败')
        // 格式校验失败，询问用户是否继续
        const confirmed = await confirm(t('config.message.formatError', { message: formatCheck.message }), t('config.message.formatErrorTitle'))
        if (!confirmed) {
        return
        }
    }

    console.log('校验通过，dialogMode:', dialogMode.value)

    if (dialogMode.value === 'edit') {
        console.log('打开 Diff 对话框')
        // 打开 Diff 对话框
        diffDialogOpen.value = true
        console.log('diffDialogOpen:', diffDialogOpen.value)
    } else {
        // 创建模式直接提交
        handleRealSubmit()
    }
}

// 提交配置
const handleRealSubmit = async () => {
  // 3. 检查配置是否存在 (仅创建模式)
  if (dialogMode.value === 'create') {
     try {
        await api.get('/v1/cs/configs', {
        params: {
            show: 'all',
            dataId: formData.value.dataId,
            group: formData.value.group,
            tenant: currentTenant.value,
            namespaceId: currentTenant.value,
        },
        })
        await alertError(t('config.message.configExists'), t('config.message.createFailed'))
        return
    } catch (error: any) {
        const errorMessage = error?.message || error?.response?.data?.message || ''
        const httpStatus = error?.response?.status
        const isNotFound = httpStatus === 404 || errorMessage.includes('配置不存在')
        if (!isNotFound) {
             if (httpStatus === 403) {
                await alertError(t('config.message.permissionDenied'))
                return
            }
            console.error('检查配置是否存在失败:', error)
            await alertError(t('config.message.checkExistsFailed'))
            return
        }
    }
  }

  // 4. 提交配置
  submitting.value = true
  const isCreate = dialogMode.value === 'create'
  try {
    await configService.createOrUpdate({
      dataId: formData.value.dataId,
      group: formData.value.group,
      content: formData.value.content,
      appName: formData.value.appName || undefined,
      desc: formData.value.desc || undefined,
      config_tags: formData.value.tags || undefined,
      type: formData.value.configType.toLowerCase(),
      tenant: currentTenant.value,
      md5: formData.value.md5,
    })

    // 保存提交的信息用于展示
    const successInfo = {
      dataId: formData.value.dataId,
      group: formData.value.group,
      appName: formData.value.appName
    }

    // 关闭 Dialog
    handleDialogClose()

    // 刷新列表
    await loadConfigList()

    if (isCreate) {
        toastSuccess(t('config.message.createSuccess'))
    } else {
        // 编辑成功，展示详情确认框
        await alertSuccess([
          `Data ID: ${successInfo.dataId}`,
          `Group: ${successInfo.group}`,
          `${t('config.table.appName')}: ${successInfo.appName || t('config.common.none')}`
        ], t('config.message.editSuccess'))
    }

  } catch (error: any) {
    console.error(isCreate ? '创建配置失败:' : '修改配置失败:', error)
    const errorMessage = error?.message || (isCreate ? t('config.message.createFailed') : t('config.message.editFailed')) + t('config.message.pleaseTryAgain')

    // Check for CAS failure
    if (errorMessage.includes('Cas publish fail') || (error.response?.data?.includes && error.response.data.includes('Cas publish fail'))) {
       await alertError(t('config.message.casFailed'), t('config.message.publishFailed'))
    } else {
       await alertError(errorMessage)
    }
  } finally {
    submitting.value = false
  }
}

const handleView = async (config: Config) => {
  try {
    loading.value = true
    // 调用 getDetail API 获取完整配置信息
    const response: any = await configService.getDetail({
      dataId: config.dataId,
      group: config.group,
      tenant: currentTenant.value,
      namespaceId: currentTenant.value,
    })

    console.log('API 返回的详情数据:', response)

    // 处理 API 返回的数据结构可能是列表的情况
    let detail = response
    if (response.pageItems && Array.isArray(response.pageItems) && response.pageItems.length > 0) {
      detail = response.pageItems[0]
    } else if (Array.isArray(response) && response.length > 0) {
        // 有些版本直接返回数组
        detail = response[0]
    }

    console.log('处理后的 detail:', detail)

    // 填充表单数据
    formData.value = {
      dataId: detail.dataId || '',
      group: detail.group || '',
      tags: detail.configTags || '',
      appName: detail.appName || '',
      desc: detail.desc || '',
      configType: detail.type || 'text',
      content: detail.content || '',
      md5: detail.md5 || '',
    }

    console.log('填充后的 formData:', formData.value)

    // 设置为详情模式并打开对话框
    dialogMode.value = 'detail'
    dialogOpen.value = true
  } catch (error) {
    console.error('获取配置详情失败:', error)
    await alertError(t('config.message.fetchDetailFailed'))
  } finally {
    loading.value = false
  }
}

// 配置比对
const handleConfigCompare = () => {
  // TODO: 实现配置比对功能
  console.log('配置比对')
}

// 版本比对
const handleVersionCompare = () => {
  // TODO: 实现版本比对功能
  console.log('版本比对')
}

const handleEdit = async (config: Config) => {
  try {
    loading.value = true
    // 调用 getDetail API 获取完整配置信息
    const response: any = await configService.getDetail({
      dataId: config.dataId,
      group: config.group,
      tenant: currentTenant.value,
      namespaceId: currentTenant.value,
    })

    // 处理 API 返回的数据结构可能是列表的情况
    let detail = response
    if (response.pageItems && Array.isArray(response.pageItems) && response.pageItems.length > 0) {
      detail = response.pageItems[0]
    } else if (Array.isArray(response) && response.length > 0) {
        // 有些版本直接返回数组
        detail = response[0]
    }

    // 填充表单数据
    formData.value = {
      dataId: detail.dataId || '',
      group: detail.group || '',
      tags: detail.configTags || '',
      appName: detail.appName || '',
      desc: detail.desc || '',
      configType: detail.type || 'text',
      content: detail.content || '',
      md5: detail.md5 || '',
    }

    // 保存原始内容用于 diff
    originalContent.value = detail.content || ''

    // 设置为编辑模式并打开对话框
    dialogMode.value = 'edit'
    dialogOpen.value = true
  } catch (error) {
    console.error('获取配置详情失败:', error)
    await alertError(t('config.message.fetchDetailFailed'))
  } finally {
    loading.value = false
  }
}

const handleDelete = async (config: Config) => {
  const confirmed = await confirm(t('config.message.deleteConfirm', { dataId: config.dataId }), t('config.message.deleteConfirmTitle'), { type: 'danger' })
  if (confirmed) {
    try {
      await configService.delete({
        dataId: config.dataId,
        group: config.group,
      })
      await loadConfigList()
      toastSuccess(t('config.message.deleteSuccess', { namespace: currentTenantShowName.value }))
    } catch (error) {
      console.error('删除配置失败:', error)
      await alertError(t('config.message.deleteFailed'))
    }
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  const confirmed = await confirm(t('config.message.batchDeleteConfirm', { count: selectedRows.value.length }), t('config.message.batchDeleteConfirmTitle'), { type: 'danger' })
  if (confirmed) {
    try {
      const ids = selectedRows.value.map((item) => item.id).join(',')
      await configService.batchDelete({
        ids,
        tenant: currentTenant.value,
      })
      const deletedCount = selectedRows.value.length
      selectedRows.value = []
      await loadConfigList()
      toastSuccess(t('config.message.batchDeleteSuccess', { namespace: currentTenantShowName.value, count: deletedCount }))
    } catch (error) {
      console.error('批量删除失败:', error)
      await alertError(t('config.message.batchDeleteFailed'))
    }
  }
}

const handleBatchClone = () => {
  if (selectedRows.value.length === 0) return

  cloneConfigs.value = selectedRows.value.map(row => ({
    cfgId: row.id,
    dataId: row.dataId,
    group: row.group
  }))

  cloneTargetTenant.value = undefined
  clonePolicy.value = 'ABORT'
  cloneErrors.value = {}
  cloneDialogOpen.value = true
}

const confirmClone = async () => {
  if (cloneTargetTenant.value === undefined) {
    cloneErrors.value.targetTenant = t('config.clone.targetNamespaceRequired')
    return
  }

  cloning.value = true
  try {
    await configService.clone({
      configs: cloneConfigs.value,
      tenant: cloneTargetTenant.value,
      policy: clonePolicy.value,
      namespaceId: '' // reference code uses empty string for namespaceId in query params
    })

    toastSuccess(t('config.message.cloneSuccess'))
    cloneDialogOpen.value = false
    selectedRows.value = []
    loadConfigList()
  } catch (error: any) {
    console.error('克隆配置失败:', error)
    const errorMessage = error?.message || error?.response?.data || t('config.message.cloneFailed')
    alertError(errorMessage, t('config.message.cloneFailed'))
  } finally {
    cloning.value = false
  }
}

const handleImport = () => {
  importDialogOpen.value = true
  importPolicy.value = 'ABORT'
  importFile.value = null
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    importFile.value = target.files[0] || null
  }
}

const confirmImport = async () => {
  if (!importFile.value) {
    alertError(t('config.import.fileRequired'))
    return
  }

  importing.value = true
  try {
    const authStore = useAuthStore()
    const currentUsername = authStore.user?.username || 'nacos'

    const response = await configService.import({
      file: importFile.value as File,
      policy: importPolicy.value as any,
      tenant: currentTenant.value,
      namespace: currentTenant.value,
      username: currentUsername
    })

    // Nacos 导入结果处理
    const succCount = response?.succCount ?? 0
    const namespace = currentTenantShowName.value

    console.log('导入结果:', response)

    await alertSuccess(
      t('config.message.importSuccess', { namespace, count: succCount }),
      t('config.message.importSuccessTitle')
    )
    importDialogOpen.value = false
    loadConfigList()
  } catch (error: any) {
    console.error('导入失败:', error)
    const errorMessage = error?.response?.data?.message || error.message || t('config.message.unknownError')
    alertError(t('config.message.importFailed') + ': ' + errorMessage)
  } finally {
    importing.value = false
  }
}

// 初始化
onMounted(async () => {
  // 同时加载命名空间和配置列表，减少首屏等待时间
  // 如果 default tenant 在加载后发生变化，loadNamespaces 内部会处理
  await Promise.all([
    loadNamespaces(),
    loadConfigList()
  ])
})
</script>

<style scoped lang="scss">
.config-list-page {
  @apply p-6 min-h-screen relative overflow-hidden;
  padding-top: 1.5rem;
  background-color: var(--wm-bg-color-page);

  // Subtle background decoration
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--wm-color-primary-light-9) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
    opacity: 0.5;
  }
}

// Micro-animations utilities
.hover-lift {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
}

// 页面标题区域
.page-title-section {
  @apply mb-6;

  .page-title {
    @apply text-2xl font-bold tracking-tight mb-0;
    color: var(--wm-color-text-primary);
  }

  .page-subtitle {
    @apply text-sm mt-1;
    color: var(--wm-color-text-secondary);
  }
}

// 命名空间页签样式
.namespace-container {
  @apply mb-6 p-1.5 rounded-xl border border-muted shadow-sm;
  background-color: var(--wm-bg-color-base);
}

.namespace-tabs {
  @apply flex flex-wrap items-center gap-1.5 p-1;
}

.namespace-tab-item {
  @apply px-4 py-1.5 text-sm rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap;
  color: var(--wm-color-text-regular);
  font-weight: 500;
  border: 1px solid transparent;

  &:hover {
    @apply shadow-sm;
    background-color: var(--wm-bg-color-page);
    color: var(--wm-color-primary);
    border-color: var(--wm-border-color-base);
  }

  &.active {
    @apply bg-primary text-white shadow-md;
    border-color: var(--wm-color-primary);
    transform: translateY(-1px);

    &:hover {
      @apply bg-primary text-white focus:outline-none;
      opacity: 0.9;
    }
  }

  &.skeleton-tab {
    @apply bg-muted/60;
    min-width: 80px;
    height: 30px;
    cursor: default;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

// 搜索栏重构样式
.search-card {
  @apply mb-6 border-none shadow-sm rounded-xl overflow-hidden;
}

.search-form-layout {
  @apply flex flex-col xl:flex-row xl:items-end gap-5;
}

.search-inputs-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1;
}

.search-field {
  @apply flex flex-col gap-1.5;

  .field-label {
    @apply text-xs font-semibold text-muted-foreground ml-0.5;
  }
}

.input-control {
  @apply relative;

  .compact-input {
    @apply h-10 pl-9 text-sm rounded-lg transition-all border-muted;
    background-color: var(--wm-bg-color-page);

    &:focus {
      @apply ring-2 ring-primary/10 border-primary shadow-sm;
      background-color: var(--wm-bg-color-base);
    }
  }

  .control-icon {
    @apply absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60;
  }
}

.search-buttons {
  @apply flex items-center gap-2.5 justify-end xl:mb-0.5;
}

.btn-search {
  @apply h-10 px-6 rounded-lg font-semibold bg-primary text-white transition-all border-2 border-transparent;
  &:hover {
    @apply opacity-90 shadow-sm;
    transform: translateY(-1px);
  }
}

.btn-reset {
  @apply h-10 px-6 rounded-lg font-medium border-2 transition-all;
  border-color: var(--wm-border-color-base);
  color: var(--wm-color-text-regular);
  &:hover {
    @apply bg-muted/50 border-muted-foreground/30;
    transform: translateY(-1px);
  }
}

// Action Bar
.action-bar {
  @apply flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 px-1 relative z-20;
}

.action-left {
  @apply flex items-center gap-4;
}

.operation-btn {
  @apply h-10 px-5 rounded-lg font-bold transition-all flex items-center justify-center whitespace-nowrap;

  // Primary variant (implicit for some, explicit for others)
  &:not(.btn-destructive) {
    @apply bg-primary text-white;
    &:hover:not(:disabled) {
      @apply bg-primary/90;
    }
  }

  // Destructive variant (Force Red using theme variable)
  &.btn-destructive {
    background-color: var(--wm-color-danger) !important;
    color: white !important;
    &:hover:not(:disabled) {
      background-color: var(--wm-color-danger-dark-1) !important;
      opacity: 0.9;
    }
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
}

.batch-actions {
  @apply flex items-center gap-2;
}

.stats-badge {
  @apply flex items-center text-sm text-muted-foreground px-4 py-1.5 rounded-xl border shadow-sm transition-all;
  background-color: var(--wm-bg-color-base);
  border-color: var(--wm-border-color-base);

  .stats-count {
    @apply font-bold text-primary mx-1 text-base;
  }
}

// Table Styles
.table-card {
  @apply overflow-hidden rounded-xl border border-muted/20 shadow-sm relative z-10;

  :deep(th) {
    @apply py-2 px-4 bg-muted/30 font-bold text-sm !important;
  }

  :deep(td) {
    @apply py-1 px-4 text-sm !important;
    height: 40px !important; // Fixed height for consistency
  }
}

.custom-checkbox {
  @apply w-4 h-4 rounded border-gray-400 transition-all cursor-pointer accent-primary appearance-none relative border-2;

  &:checked {
    @apply bg-primary border-primary;

    &::after {
      content: '✓';
      @apply absolute inset-0 flex items-center justify-center text-xs text-white font-bold;
    }
  }
}

.selected-row {
  @apply bg-primary/5 transition-colors;

  &:hover {
    @apply bg-primary/10;
  }
}

.data-id-cell {
  @apply flex items-center;

  span {
    @apply font-semibold;
    color: var(--wm-color-text-primary);
  }
}

.group-tag {
  @apply px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider;
  background-color: var(--wm-color-primary-light-9);
  color: var(--wm-color-primary);
  border: 1px solid var(--wm-color-primary-light-8);
}

.action-cell {
  @apply w-[220px];
}

.action-buttons-row {
  @apply flex items-center justify-start gap-1;
}

.action-separator {
  @apply text-muted-foreground/30 text-sm mx-0.5 pointer-events-none;
}

.action-btn {
  @apply h-8 px-2 text-sm font-semibold hover:bg-muted/50 rounded-md transition-colors;

  &.text-primary { @apply text-primary hover:text-primary/80; }
  &.text-info { color: var(--wm-color-info); }
  &.text-destructive { @apply text-destructive hover:text-destructive/80; }
}

.text-info {
  color: #3b82f6;
}

// Dialog Refinements
:deep(.config-create-dialog) {
  @apply rounded-3xl overflow-hidden shadow-2xl transition-all;
  background: var(--wm-bg-color-base);
}

.config-content-textarea {
  @apply rounded-xl border-none ring-1 ring-muted shadow-inner transition-all;
  background-color: #0d1117;
  color: #e5e7eb;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  line-height: 1.6;
  padding: 1.5rem 1.5rem 1.5rem 4rem;

  &:focus-visible {
    @apply ring-2 ring-primary ring-offset-2 ring-offset-white;
    outline: none;
  }

  // Improved line numbers simulation
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 100% 1.6em;
  padding-left: 4rem;

  &::before {
    content: '';
    @apply absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-white/5;
  }
}

.required::after {
  content: ' *';
  @apply text-destructive ml-0.5;
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl;
  background-color: rgba(255, 255, 255, 0.4);

  :global([data-theme='dark']) & {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.loading-spinner {
  @apply w-12 h-12 border-4 rounded-full animate-spin mb-4;
  border-color: var(--wm-color-primary-light-7);
  border-top-color: var(--wm-color-primary);
}

// 分页重构
.pagination-container {
  @apply flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-muted/20 gap-4;
  background-color: var(--wm-bg-color-base);
}

.pagination-info {
  @apply text-sm text-muted-foreground font-medium;
}

.pagination-controls {
  @apply flex items-center gap-6;
}

.page-size-picker {
  @apply flex items-center gap-2;
}

.page-navigation {
  @apply flex items-center gap-3;
}

.page-numbers {
  @apply flex items-center gap-1.5 px-3 py-1 bg-muted/20 rounded-md text-sm font-bold;
  .current-page { color: var(--wm-color-primary); }
  .page-divider { @apply text-muted-foreground/50; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

// Responsive adjustments
@media (max-width: 768px) {
  .search-row { @apply flex-col; }
  .search-actions { @apply w-full flex-row; }
  .query-btn, .reset-btn { @apply flex-1; }
}
// Dropdown styles
.export-dropdown-content {
  @apply bg-background border shadow-xl rounded-lg p-1 z-[100];
}

.export-item {
  @apply flex items-center px-3 py-2 text-sm rounded-md transition-all cursor-pointer;
  color: var(--wm-color-text-regular);

  &:hover {
    background-color: var(--wm-color-primary-light-9);
    color: var(--wm-color-primary);
  }

  &[data-disabled="true"] {
    @apply opacity-50 cursor-not-allowed grayscale pointer-events-none;
  }
}
</style>
