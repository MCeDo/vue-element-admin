<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('类别')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column v-if="false" :label="$t('类别ID')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('类别名称')" min-width="50px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
          <!--<el-tag>{{ scope.row.name | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type==2" :label="$t('图标')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.date')" prop="createdTime">
          <el-date-picker v-model="temp.createdTime" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item :label="$t('名称')" prop="username">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('图标')" prop="nickname">
          <el-input v-model="temp.url"/>
          <el-button type="primary" icon="upload" style="position: absolute;bottom: 0px;margin-left: 340px;" @click="imagecropperShow=true">更换图标
          </el-button>
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            url="/shop/file/image"
            field="file"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"/>
        </el-form-item>
        <el-form-item>
          <img :src="temp.url" width="100px" height="100px">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createCate, updateCate, deleteCate } from '@/api/cate'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserManager',
  components: { Pagination, PanThumb, ImageCropper },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        cate: undefined,
        createdTime: undefined,
        type: undefined
      },
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        createdTime: undefined,
        url: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        createdTime: [{ type: 'date', required: true, message: 'createdTime is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }],
        url: [{ required: true, message: 'url is required', trigger: 'blur' }]
      },
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const data = response.data.data
        // const data = response.data
        this.list = data.records
        this.total = Number(data.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.list = this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        url: '',
        createdTime: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCate(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.total += 1
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCate(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteCate(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.total = this.total - 1
        // TODO 发起请求拿一条数据补充
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    cropSuccess(resData) {
      console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.url = resData.data
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

